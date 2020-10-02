import {
  FunctionDeclaration,
  ArgumentDeclaration,
} from './TypescriptDeclaration/FunctionDeclaration';
import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import {
  InterfaceDeclaration,
  InterfaceAttributeDeclaration,
} from './TypescriptDeclaration/InterfaceDeclaration';
import { ClassDeclaration } from './TypescriptDeclaration/ClassDeclaration';
import { FunctionDeclarationCleaner } from './FunctionDeclarationCleaner';
import { ModuleTypescriptDeclaration } from './TypescriptDeclaration/ModuleDeclaration/ModuleTypescriptDeclaration';
import { ModuleClassTypescriptDeclaration } from './TypescriptDeclaration/ModuleDeclaration/ModuleClassTypescriptDeclaration';
import { BaseModuleTypescriptDeclaration } from './TypescriptDeclaration/ModuleDeclaration/BaseModuleTypescriptDeclaration';
import { ModuleFunctionTypescriptDeclaration } from './TypescriptDeclaration/ModuleDeclaration/ModuleFunctionTypescriptDeclaration';
import { InterfaceSubsetPrimitiveValidator } from './utils/InterfaceSubsetPrimitiveValidator';

export class TypescriptDeclarationBuilder {
  interfaceNames: { [id: string]: boolean };
  interfaceDeclarations: { [id: string]: InterfaceDeclaration };
  interfaceNameCounter: number;
  moduleName: string;
  classes: { [id: string]: ClassDeclaration };
  functionDeclarations: FunctionDeclaration[];
  cleaner: FunctionDeclarationCleaner;
  interfaceSubsetPrimitiveValidator: InterfaceSubsetPrimitiveValidator;

  constructorFunctionId: string;

  constructor(cleaner: FunctionDeclarationCleaner) {
    this.cleaner = cleaner;
    this.interfaceNames = {};
    this.interfaceDeclarations = {};
    this.interfaceNameCounter = 0;
    this.moduleName = '';
    this.classes = {};
    this.functionDeclarations = [];
    this.constructorFunctionId = '';
    this.interfaceSubsetPrimitiveValidator = new InterfaceSubsetPrimitiveValidator();
  }

  private getInterfaceDeclarations(): InterfaceDeclaration[] {
    const i: InterfaceDeclaration[] = [];

    for (const k in this.interfaceDeclarations) {
      i.push(this.interfaceDeclarations[k]);
    }

    return i;
  }

  private getClassDeclarations(): ClassDeclaration[] {
    const classes: ClassDeclaration[] = [];

    for (const k in this.classes) {
      classes.push(this.classes[k]);
    }

    classes.forEach((c) => {
      c.methods = this.cleaner.clean(c.methods);
    });

    return classes;
  }

  private getFunctionDeclarations(): FunctionDeclaration[] {
    return this.cleaner.clean(this.functionDeclarations);
  }

  build(
    runTimeInfo: { [id: string]: RunTimeInfoUtils.FunctionRuntimeInfo },
    moduleName: string,
  ): BaseModuleTypescriptDeclaration {
    this.moduleName = moduleName;

    for (const key in runTimeInfo) {
      this.functionDeclarations = this.functionDeclarations.concat(
        this.processRunTimeInfoElement(runTimeInfo[key]),
      );
    }

    const functionDeclarations = this.getFunctionDeclarations();
    const interfaceDeclarations = this.getInterfaceDeclarations();
    const classDeclarations = this.getClassDeclarations();

    const typescriptDeclaration = this.getTypescriptDeclaration(runTimeInfo);

    typescriptDeclaration.module = moduleName;
    typescriptDeclaration.classes = classDeclarations;
    typescriptDeclaration.methods = functionDeclarations;
    typescriptDeclaration.interfaces = interfaceDeclarations;

    return typescriptDeclaration;
  }

  private processRunTimeInfoElement(
    functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo,
  ): FunctionDeclaration[] {
    const functionDeclarations: FunctionDeclaration[] = [];

    if (
      this.extractModuleName(functionRunTimeInfo.requiredModule) === this.moduleName ||
      functionRunTimeInfo.constructedBy in this.classes
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
    functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo,
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

      this.classes[functionRunTimeInfo.functionId] = c;
    } else {
      if (functionRunTimeInfo.constructedBy in this.classes) {
        this.classes[functionRunTimeInfo.constructedBy].addMethod(functionDeclaration);
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
    argument: RunTimeInfoUtils.ArgumentRuntimeInfo,
    functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo,
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

  private filterInteractionsForComputingInterfaces(
    interactions: RunTimeInfoUtils.InteractionRuntimeInfo[],
  ) {
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
    for (const k in this.interfaceDeclarations) {
      if (this.interfaceDeclarations[k].name === name) {
        delete this.interfaceDeclarations[k];
      }
    }
  }

  private getInterfaceName(name: string): string {
    return 'I__' + name;
  }

  private buildInterfaceDeclaration(
    interactions: RunTimeInfoUtils.InteractionRuntimeInfo[],
    name: string,
    argument: RunTimeInfoUtils.ArgumentRuntimeInfo,
    functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo,
  ): InterfaceDeclaration {
    const interfaceDeclaration = new InterfaceDeclaration();

    interactions.forEach((interaction) => {
      let filteredFollowingInteractions: RunTimeInfoUtils.InteractionRuntimeInfo[] = [];
      if (interaction.followingInteractions) {
        filteredFollowingInteractions = this.filterInteractionsForComputingInterfaces(
          interaction.followingInteractions,
        );
      }

      let attributeType: string;
      if (filteredFollowingInteractions.length > 0) {
        const followingInterfaceDeclaration = this.buildInterfaceDeclaration(
          filteredFollowingInteractions,
          this.getInterfaceName(interaction.field),
          argument,
          functionRunTimeInfo,
        );

        attributeType = this.matchToTypescriptType(followingInterfaceDeclaration.name);
      } else {
        attributeType = this.matchToTypescriptType(interaction.returnTypeOf);
      }

      interfaceDeclaration.addAttribute(interaction.field, [attributeType]);
    });

    interfaceDeclaration.name = name;
    this.addInterfaceDeclaration(interfaceDeclaration, argument, functionRunTimeInfo);

    return interfaceDeclaration;
  }

  private addInterfaceDeclaration(
    interfaceDeclaration: InterfaceDeclaration,
    argument: RunTimeInfoUtils.ArgumentRuntimeInfo,
    functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo,
  ): void {
    const serializedInterface = [
      interfaceDeclaration.name,
      argument.argumentIndex,
      argument.argumentName,
      functionRunTimeInfo.functionId,
    ].join('__');

    if (serializedInterface in this.interfaceDeclarations) {
      this.interfaceDeclarations[serializedInterface].mergeWith(interfaceDeclaration);
    } else {
      let interfaceName = interfaceDeclaration.name;
      while (interfaceName in this.interfaceNames) {
        this.interfaceNameCounter++;
        interfaceName = interfaceDeclaration.name + '__' + this.interfaceNameCounter;
      }

      interfaceDeclaration.name = interfaceName;

      this.interfaceNames[interfaceDeclaration.name] = true;
      this.interfaceDeclarations[serializedInterface] = interfaceDeclaration;
    }
  }

  private getInputTypeOfs(argument: RunTimeInfoUtils.ArgumentRuntimeInfo): string[] {
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

  private getTypescriptDeclaration(runTimeInfo: {
    [id: string]: RunTimeInfoUtils.FunctionRuntimeInfo;
  }): BaseModuleTypescriptDeclaration {
    for (const key in runTimeInfo) {
      const functionRunTimeInfo = runTimeInfo[key];

      if (this.extractModuleName(functionRunTimeInfo.requiredModule) === this.moduleName) {
        if (functionRunTimeInfo.isExported === true) {
          if (functionRunTimeInfo.isConstructor === true) {
            return new ModuleClassTypescriptDeclaration();
          } else {
            return new ModuleFunctionTypescriptDeclaration();
          }
        }
      }
    }

    return new ModuleTypescriptDeclaration();
  }
}
