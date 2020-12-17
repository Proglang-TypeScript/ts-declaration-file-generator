import ArgumentDeclaration from './ArgumentDeclaration';
import { FunctionDeclaration } from './FunctionDeclaration';
import { InterfaceDeclaration } from './InterfaceDeclaration';
import { ClassDeclaration } from './ClassDeclaration';
import { FunctionDeclarationCleaner } from './utils/FunctionDeclarationCleaner';
import { InterfaceSubsetPrimitiveValidator } from './utils/InterfaceSubsetPrimitiveValidator';
import {
  FunctionRuntimeInfo,
  ArgumentRuntimeInfo,
  InteractionRuntimeInfo,
} from '../../runtime-info/parser/parsedTypes';
import { DTS } from '../ast/types';
import { TypescriptDeclaration } from './types/TypescriptDeclaration';
import { createDTSModuleClass } from '../dts/moduleClass';
import { createDTSModuleFunction } from '../dts/moduleFunction';
import { createDTSModule } from '../dts/module';

type CreateDTS = (typescriptDeclaration: TypescriptDeclaration) => DTS;

export class TypescriptDeclarationBuilder {
  private interfaceNames = new Set<string>();
  private interfaceDeclarations = new Map<string, InterfaceDeclaration>();
  private interfaceNameCounter = 0;
  private moduleName = '';
  private classes = new Map<string, ClassDeclaration>();
  private functionDeclarations: FunctionDeclaration[] = [];
  private cleaner = new FunctionDeclarationCleaner();
  private interfaceSubsetPrimitiveValidator = new InterfaceSubsetPrimitiveValidator();

  private getInterfaceDeclarations(): InterfaceDeclaration[] {
    return Array.from(this.interfaceDeclarations.values());
  }

  private getClassDeclarations(): ClassDeclaration[] {
    return Array.from(this.classes.values()).map((c) => {
      c.methods = this.cleaner.clean(c.methods);
      return c;
    });
  }

  private getFunctionDeclarations(): FunctionDeclaration[] {
    return this.cleaner.clean(this.functionDeclarations);
  }

  build(runTimeInfo: { [id: string]: FunctionRuntimeInfo }, moduleName: string): DTS {
    this.moduleName = moduleName;

    for (const key in runTimeInfo) {
      this.functionDeclarations = this.functionDeclarations.concat(
        this.processRunTimeInfoElement(runTimeInfo[key]),
      );
    }

    const functionDeclarations = this.getFunctionDeclarations();
    const interfaceDeclarations = this.getInterfaceDeclarations();
    const classDeclarations = this.getClassDeclarations();

    const typescripDeclaration: TypescriptDeclaration = {
      module: moduleName,
      classes: classDeclarations,
      methods: functionDeclarations,
      interfaces: interfaceDeclarations,
    };

    const createDTS = this.getCreateDTS(runTimeInfo);
    return createDTS(typescripDeclaration);
  }

  private processRunTimeInfoElement(
    functionRunTimeInfo: FunctionRuntimeInfo,
  ): FunctionDeclaration[] {
    const functionDeclarations: FunctionDeclaration[] = [];

    if (
      this.extractModuleName(functionRunTimeInfo.requiredModule) === this.moduleName ||
      this.classes.has(functionRunTimeInfo.constructedBy)
    ) {
      for (const traceId in functionRunTimeInfo.returnTypeOfs) {
        const functionDeclaration = this.getFunctionDeclaration(
          functionDeclarations,
          functionRunTimeInfo,
          traceId,
        );

        if (functionRunTimeInfo.args.hasOwnProperty(traceId)) {
          const argumentInfo = functionRunTimeInfo.args[traceId];
          argumentInfo.forEach((argument) => {
            const argumentDeclaration = new ArgumentDeclaration(
              argument.argumentIndex,
              argument.argumentName,
            );

            this.mergeArgumentTypeOfs(
              this.getInputTypeOfs(argument),
              this.getInterfacesForArgument(argument, functionRunTimeInfo),
            ).forEach((typeOf) => {
              argumentDeclaration.addTypeOf(this.matchToTypescriptType(typeOf));
            });

            functionDeclaration.addArgument(argumentDeclaration);
          });
        }
      }
    }

    return functionDeclarations;
  }

  private getFunctionDeclaration(
    functionDeclarations: FunctionDeclaration[],
    functionRunTimeInfo: FunctionRuntimeInfo,
    traceId: string,
  ): FunctionDeclaration {
    const functionDeclaration = new FunctionDeclaration();
    functionDeclaration.name = functionRunTimeInfo.functionName;
    functionDeclaration.addReturnTypeOf(
      this.matchReturnTypeOfs(functionRunTimeInfo.returnTypeOfs[traceId]),
    );
    functionDeclaration.isExported = functionRunTimeInfo.isExported;

    if (functionRunTimeInfo.isConstructor) {
      const c = new ClassDeclaration();
      c.setConstructor(functionDeclaration);

      this.classes.set(functionRunTimeInfo.functionId, c);
    } else {
      if (this.classes.has(functionRunTimeInfo.constructedBy)) {
        this.classes.get(functionRunTimeInfo.constructedBy)?.addMethod(functionDeclaration);
      } else {
        functionDeclarations.push(functionDeclaration);
      }
    }

    return functionDeclaration;
  }

  private extractModuleName(m: string) {
    return m.replace(/^.*[\/]/, '').replace(/\.[^/.]+$/, '');
  }

  private getInterfacesForArgument(
    argument: ArgumentRuntimeInfo,
    functionRunTimeInfo: FunctionRuntimeInfo,
  ): InterfaceDeclaration[] {
    const interfaces: InterfaceDeclaration[] = [];
    const interactionsConsideredForInterfaces = this.filterInteractionsForComputingInterfaces(
      argument.interactions,
    );

    if (interactionsConsideredForInterfaces.length > 0) {
      interfaces.push(
        this.buildInterfaceDeclaration(
          interactionsConsideredForInterfaces,
          this.getInterfaceName(argument.argumentName),
          argument,
          functionRunTimeInfo,
        ),
      );
    }

    return interfaces;
  }

  private filterInteractionsForComputingInterfaces(interactions: InteractionRuntimeInfo[]) {
    return interactions.filter((v) => {
      return v.code === 'getField';
    });
  }

  private mergeArgumentTypeOfs(
    inputTypeOfs: string[],
    interfacesTypeOfs: InterfaceDeclaration[],
  ): string[] {
    if (interfacesTypeOfs.length > 0) {
      inputTypeOfs = inputTypeOfs.filter((val) => {
        return val !== 'object';
      });
    }

    const inputHasString = inputTypeOfs.includes('string');

    return inputTypeOfs.concat(
      interfacesTypeOfs
        .filter((i) => {
          if (
            inputHasString &&
            this.interfaceSubsetPrimitiveValidator.isInterfaceSubsetOfString(i)
          ) {
            this.removeInterfaceDeclaration(i.name);
            return false;
          }

          return true;
        })
        .map((i) => i.name),
    );
  }

  private removeInterfaceDeclaration(name: string) {
    Array.from(this.interfaceDeclarations.entries()).forEach(([key, interfaceDeclaration]) => {
      if (interfaceDeclaration.name === name) {
        this.interfaceDeclarations.delete(key);
      }
    });
  }

  private getInterfaceName(name: string): string {
    return 'I__' + name;
  }

  private buildInterfaceDeclaration(
    interactions: InteractionRuntimeInfo[],
    name: string,
    argument: ArgumentRuntimeInfo,
    functionRunTimeInfo: FunctionRuntimeInfo,
  ): InterfaceDeclaration {
    const interfaceDeclaration = new InterfaceDeclaration();

    interactions.forEach((interaction) => {
      let filteredFollowingInteractions: InteractionRuntimeInfo[] = [];
      if (interaction.followingInteractions) {
        filteredFollowingInteractions = this.filterInteractionsForComputingInterfaces(
          interaction.followingInteractions,
        );
      }

      let attributeType: string;
      if (filteredFollowingInteractions.length > 0) {
        const followingInterfaceDeclaration = this.buildInterfaceDeclaration(
          filteredFollowingInteractions,
          this.getInterfaceName(`${interaction.field}`),
          argument,
          functionRunTimeInfo,
        );

        attributeType = this.matchToTypescriptType(followingInterfaceDeclaration.name);
      } else {
        attributeType = this.matchToTypescriptType(interaction.returnTypeOf);
      }

      interfaceDeclaration.addAttribute(`${interaction.field}`, [attributeType]);
    });

    interfaceDeclaration.name = name;
    this.addInterfaceDeclaration(interfaceDeclaration, argument, functionRunTimeInfo);

    return interfaceDeclaration;
  }

  private addInterfaceDeclaration(
    interfaceDeclaration: InterfaceDeclaration,
    argument: ArgumentRuntimeInfo,
    functionRunTimeInfo: FunctionRuntimeInfo,
  ): void {
    const serializedInterface = [
      interfaceDeclaration.name,
      argument.argumentIndex,
      argument.argumentName,
      functionRunTimeInfo.functionId,
    ].join('__');

    const existingInterface = this.interfaceDeclarations.get(serializedInterface);
    if (existingInterface) {
      existingInterface.mergeWith(interfaceDeclaration);
    } else {
      let interfaceName = interfaceDeclaration.name;
      while (this.interfaceNames.has(interfaceName)) {
        this.interfaceNameCounter++;
        interfaceName = interfaceDeclaration.name + '__' + this.interfaceNameCounter;
      }

      interfaceDeclaration.name = interfaceName;

      this.interfaceNames.add(interfaceDeclaration.name);
      this.interfaceDeclarations.set(serializedInterface, interfaceDeclaration);
    }
  }

  private getInputTypeOfs(argument: ArgumentRuntimeInfo): string[] {
    return argument.interactions
      .filter((interaction) => {
        return interaction.code === 'inputValue';
      })
      .map((interaction) => {
        return this.matchToTypescriptType(interaction.typeof);
      });
  }

  private matchToTypescriptType(t: string): string {
    const m: { [id: string]: string } = {
      string: 'string',
      number: 'number',
      undefined: 'undefined',
      null: 'null',
      object: 'object',
      array: 'Array<any>',
      boolean: 'boolean',
      function: 'Function',
    };

    if (!(t in m)) {
      return t;
    }

    return m[t];
  }

  private matchReturnTypeOfs(t: string): string {
    const m: { [id: string]: string } = {
      string: 'string',
      number: 'number',
      undefined: 'void',
      null: 'null',
      object: 'object',
      array: 'Array<any>',
      boolean: 'boolean',
      function: 'Function',
    };

    if (!(t in m)) {
      return t;
    }

    return m[t];
  }

  private getCreateDTS(runTimeInfo: { [id: string]: FunctionRuntimeInfo }): CreateDTS {
    for (const key in runTimeInfo) {
      const functionRunTimeInfo = runTimeInfo[key];

      if (this.extractModuleName(functionRunTimeInfo.requiredModule) === this.moduleName) {
        if (functionRunTimeInfo.isExported === true) {
          if (functionRunTimeInfo.isConstructor === true) {
            return createDTSModuleClass;
          } else {
            return createDTSModuleFunction;
          }
        }
      }
    }

    return createDTSModule;
  }
}
