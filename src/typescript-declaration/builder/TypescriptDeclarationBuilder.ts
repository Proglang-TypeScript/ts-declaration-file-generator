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
import { DTS, DTSType, DTSTypeKeywords, DTSTypeKinds } from '../ast/types';
import { TypescriptDeclaration } from './types/TypescriptDeclaration';
import { extractModuleName } from './helpers/extractModuleName';
import { getCreateDTSFn } from './helpers/getCreateDTSFn';
import {
  createInterface,
  mergeDTSTypes,
  createString,
  createNumber,
  createUndefined,
  createNull,
  createObject,
  createArray,
  createAny,
  createBoolean,
  createFunction,
  createVoid,
} from '../dts/helpers/createDTSType';
import objectHash from 'object-hash';

export class TypescriptDeclarationBuilder {
  private interfaceNames = new Map<string, InterfaceDeclaration>();
  private interfaceDeclarations = new Map<string, InterfaceDeclaration>();
  private interfaceNameCounter = 0;
  private moduleName = '';
  private classes = new Map<string, ClassDeclaration>();
  private functionDeclarations: FunctionDeclaration[] = [];
  private cleaner = new FunctionDeclarationCleaner();
  private interfaceSubsetPrimitiveValidator = new InterfaceSubsetPrimitiveValidator();

  private getInterfaceDeclarations(): InterfaceDeclaration[] {
    return Array.from(this.interfaceNames.values());
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

    const createDTS = getCreateDTSFn(runTimeInfo, this.moduleName);
    return createDTS(typescripDeclaration);
  }

  private processRunTimeInfoElement(
    functionRunTimeInfo: FunctionRuntimeInfo,
  ): FunctionDeclaration[] {
    const functionDeclarations: FunctionDeclaration[] = [];

    if (
      extractModuleName(functionRunTimeInfo.requiredModule) === this.moduleName ||
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

            this.mergeTypeWithInterface(
              this.getInputTypeOfs(argument),
              this.getInterfacesForArgument(argument, functionRunTimeInfo),
            ).forEach((typeOf) => {
              argumentDeclaration.addTypeOf(typeOf);
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

  private getInterfacesForArgument(
    argument: ArgumentRuntimeInfo,
    functionRunTimeInfo: FunctionRuntimeInfo,
  ): InterfaceDeclaration | undefined {
    const interactionsConsideredForInterfaces = this.filterInteractionsForComputingInterfaces(
      argument.interactions,
    );

    if (interactionsConsideredForInterfaces.length === 0) {
      return;
    }

    return this.buildInterfaceDeclaration(
      interactionsConsideredForInterfaces,
      this.getInterfaceName(argument.argumentName),
      argument,
      functionRunTimeInfo,
    );
  }

  private filterInteractionsForComputingInterfaces(interactions: InteractionRuntimeInfo[]) {
    return interactions.filter((v) => {
      return v.code === 'getField';
    });
  }

  private mergeTypeWithInterface(
    inputTypeOfs: DTSType[],
    interfaceDeclaration?: InterfaceDeclaration,
  ): DTSType[] {
    if (!interfaceDeclaration) {
      return inputTypeOfs;
    }

    inputTypeOfs = inputTypeOfs.filter((type) => {
      return type.value !== DTSTypeKeywords.OBJECT;
    });

    if (inputTypeOfs.some((t) => t.value === DTSTypeKeywords.STRING)) {
      return this.mergeTypesForString(inputTypeOfs, interfaceDeclaration);
    }

    if (inputTypeOfs.some((t) => t.kind === DTSTypeKinds.ARRAY)) {
      return this.mergeTypesForArray(inputTypeOfs, interfaceDeclaration);
    }

    return [...inputTypeOfs, createInterface(interfaceDeclaration.name)];
  }

  private mergeTypesForString(
    inputTypeOfs: DTSType[],
    interfaceDeclaration: InterfaceDeclaration,
  ): DTSType[] {
    if (!this.interfaceSubsetPrimitiveValidator.isInterfaceSubsetOfString(interfaceDeclaration)) {
      return [...inputTypeOfs, createInterface(interfaceDeclaration.name)];
    }

    this.removeInterfaceDeclaration(interfaceDeclaration);
    return inputTypeOfs;
  }

  private mergeTypesForArray(
    inputTypeOfs: DTSType[],
    interfaceDeclaration: InterfaceDeclaration,
  ): DTSType[] {
    if (!this.interfaceSubsetPrimitiveValidator.isInterfaceSubsetOfArray(interfaceDeclaration)) {
      return [...inputTypeOfs, createInterface(interfaceDeclaration.name)];
    }

    const interfaceArrayElement = new InterfaceDeclaration();
    interfaceArrayElement.name = `${interfaceDeclaration.name}_element`;
    const arrayElementTypes = new Map<string, DTSType>();

    interfaceDeclaration.getAttributes().forEach((attribute) => {
      if (this.interfaceSubsetPrimitiveValidator.isArrayElement(attribute.name)) {
        attribute.getTypeOfs().forEach((attributeTypeOf) => {
          const interfaceOfAttribute =
            attributeTypeOf.kind === DTSTypeKinds.INTERFACE &&
            this.interfaceNames.get(attributeTypeOf.value);

          if (interfaceOfAttribute) {
            interfaceArrayElement.mergeWith(interfaceOfAttribute);
            this.removeInterfaceDeclaration(interfaceOfAttribute);
          } else {
            arrayElementTypes.set(objectHash(attributeTypeOf), attributeTypeOf);
          }
        });
      }
    });

    if (arrayElementTypes.size === 0) {
      const anyDTSType = createAny();
      arrayElementTypes.set(objectHash(anyDTSType), anyDTSType);
    }

    let arrayElementTypesValues: DTSType[] = Array.from(arrayElementTypes.values());

    if (interfaceArrayElement.getAttributes().length > 0) {
      const interfaceType = createInterface(interfaceArrayElement.name);
      arrayElementTypes.set(objectHash(interfaceType), interfaceType);
      this.interfaceNames.set(interfaceArrayElement.name, interfaceArrayElement);

      arrayElementTypesValues = this.mergeTypesForArray(
        arrayElementTypesValues,
        interfaceArrayElement,
      );
    }

    arrayElementTypesValues = this.filterTypeOfs(arrayElementTypesValues);

    this.removeInterfaceDeclaration(interfaceDeclaration);

    return inputTypeOfs.map((i) => {
      if (i.kind !== DTSTypeKinds.ARRAY) {
        return i;
      }

      i.value = mergeDTSTypes(arrayElementTypesValues);
      return i;
    });
  }

  private removeInterfaceDeclaration(interfaceToBeRemoved: InterfaceDeclaration) {
    let interfaceShouldBeRemoved = false;

    const i = this.interfaceNames.get(interfaceToBeRemoved.name);
    if (i) {
      interfaceToBeRemoved.getAttributes().forEach((a) => {
        i.removeAttribute(a);
      });

      interfaceShouldBeRemoved = i.getAttributes().length === 0;
    }

    if (interfaceShouldBeRemoved) {
      this.interfaceNames.delete(interfaceToBeRemoved.name);
      [...this.interfaceDeclarations.entries()].forEach(([key, i]) => {
        if (i.name === interfaceToBeRemoved.name) {
          this.interfaceDeclarations.delete(key);
        }
      });
    }
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

      let attributeType: DTSType[] = [this.matchToTypescriptType(interaction.returnTypeOf)];
      if (filteredFollowingInteractions.length > 0) {
        const followingInterfaceDeclaration = this.buildInterfaceDeclaration(
          filteredFollowingInteractions,
          this.getInterfaceName(`${interaction.field}`),
          argument,
          functionRunTimeInfo,
        );

        attributeType = this.mergeTypeWithInterface(attributeType, followingInterfaceDeclaration);
      }

      interfaceDeclaration.addAttribute(`${interaction.field}`, attributeType);
    });

    interfaceDeclaration.name = name;
    interfaceDeclaration.filterTypeOfs(this.filterTypeOfs);

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

      this.interfaceNames.set(interfaceDeclaration.name, interfaceDeclaration);
      this.interfaceDeclarations.set(serializedInterface, interfaceDeclaration);
    }
  }

  private filterTypeOfs(mergedTypes: DTSType[]): DTSType[] {
    const anyTypeHash = objectHash(createAny());
    const objectTypeHash = objectHash(createObject());
    const hasSpecificArrayType = mergedTypes.some(
      (t) => t.kind === DTSTypeKinds.ARRAY && objectHash(t.value) !== anyTypeHash,
    );

    const hasInterfaceType = mergedTypes.some((t) => t.kind === DTSTypeKinds.INTERFACE);

    return mergedTypes.filter((t) => {
      if (hasSpecificArrayType && objectHash(t.value) === anyTypeHash) {
        return false;
      }

      if (hasInterfaceType && objectHash(t) === objectTypeHash) {
        return false;
      }

      return true;
    });
  }

  private getInputTypeOfs(argument: ArgumentRuntimeInfo): DTSType[] {
    return argument.interactions
      .filter((interaction) => {
        return interaction.code === 'inputValue' && interaction.typeof !== '';
      })
      .map((interaction) => {
        return this.matchToTypescriptType(interaction.typeof);
      });
  }

  private matchToTypescriptType(t: string): DTSType {
    const map = new Map<string, DTSType>()
      .set('string', createString())
      .set('number', createNumber())
      .set('undefined', createUndefined())
      .set('null', createNull())
      .set('object', createObject())
      .set('array', createArray(createAny()))
      .set('boolean', createBoolean())
      .set('function', createFunction());

    const match = map.get(t);
    if (match) {
      return match;
    }

    return createInterface(t);
  }

  private matchReturnTypeOfs(t: string): DTSType {
    const map = new Map<string, DTSType>()
      .set('string', createString())
      .set('number', createNumber())
      .set('undefined', createVoid())
      .set('null', createNull())
      .set('object', createObject())
      .set('array', createArray(createAny()))
      .set('boolean', createBoolean())
      .set('function', createFunction());

    const match = map.get(t);
    if (match) {
      return match;
    }

    return createInterface(t);
  }
}
