import { FunctionDeclaration, ArgumentDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";
import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import { InterfaceDeclaration, InterfaceAttributeDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';
import { ClassDeclaration } from './TypescriptDeclaration/ClassDeclaration';
import { FunctionDeclarationCleaner } from "./FunctionDeclarationCleaner";

export class FunctionDeclarationBuilder {
    interfaceNames: { [id: string]: boolean };
    interfaceDeclarations : { [id: string] : InterfaceDeclaration; };
    interfaceNameCounter : number;
    moduleName: string;
    classes: { [id: string]: ClassDeclaration; };
    functionDeclarations: FunctionDeclaration[];
    cleaner: FunctionDeclarationCleaner;

    constructorFunctionId: string;

    constructor(
        cleaner: FunctionDeclarationCleaner
    ) {
        this.cleaner = cleaner;
        this.interfaceNames = {}
        this.interfaceDeclarations = {};
        this.interfaceNameCounter = 0;
        this.moduleName = "";
        this.classes = {};
        this.functionDeclarations = [];
        this.constructorFunctionId = "";
    };

    getInterfaceDeclarations(): InterfaceDeclaration[] {
        let i : InterfaceDeclaration[] = [];

        for (let k in this.interfaceDeclarations) {
            i.push(this.interfaceDeclarations[k]);
        }

        return i;
    }

    getClassDeclarations(): ClassDeclaration[] {
        let classes: ClassDeclaration[] = [];

        for (let k in this.classes) {
            classes.push(this.classes[k]);
        }

        classes.forEach(c => {
            c.methods = this.cleaner.clean(c.methods);
        });

        return classes;
    }

    getFunctionDeclarations(): FunctionDeclaration[] {
        return this.cleaner.clean(this.functionDeclarations);
    }

    buildAll(
        runTimeInfo: { [id: string]: RunTimeInfoUtils.FunctionRuntimeInfo },
        moduleName: string
    ): void {

        this.moduleName = moduleName;

        for (let key in runTimeInfo) {
            this.functionDeclarations = this.functionDeclarations.concat(this.build(runTimeInfo[key]));
        }
    }

    private build(functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo) : FunctionDeclaration[] {
        let functionDeclarations: FunctionDeclaration[] = [];

        if (
            this.extractModuleName(functionRunTimeInfo.requiredModule) === this.moduleName ||
            functionRunTimeInfo.constructedBy in this.classes
        ) {

            for (const traceId in functionRunTimeInfo.returnTypeOfs) {
                let functionDeclaration = this.getFunctionDeclaration(
                    functionDeclarations,
                    functionRunTimeInfo,
                    traceId
                );

                if (functionRunTimeInfo.args.hasOwnProperty(traceId)) {
                    const argumentInfo = functionRunTimeInfo.args[traceId];
                    argumentInfo.forEach(argument => {
                        let argumentDeclaration = new ArgumentDeclaration(
                            argument.argumentIndex,
                            argument.argumentName
                        );

                        this.mergeArgumentTypeOfs(
                            this.getInputTypeOfs(argument),
                            this.getInterfacesForArgument(argument, functionRunTimeInfo).map(
                                i => {return i.name;}
                            )
                        ).forEach(typeOf => {
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
        traceId: string
    ) : FunctionDeclaration {

        let functionDeclaration = new FunctionDeclaration();
        functionDeclaration.name = functionRunTimeInfo.functionName;
        functionDeclaration.addReturnTypeOf(this.matchReturnTypeOfs(functionRunTimeInfo.returnTypeOfs[traceId]));

        if (functionRunTimeInfo.isConstructor) {
            let c = new ClassDeclaration();
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
        return m.replace(/^.*[\/]/, '').replace(/\.[^/.]+$/, "");
    }

    private getInterfacesForArgument(argument: RunTimeInfoUtils.ArgumentRuntimeInfo, functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo): InterfaceDeclaration[] {
        let interfaces : InterfaceDeclaration[] = [];
        let interactionsConsideredForInterfaces = this.filterInteractionsForComputingInterfaces(argument.interactions);

        if (interactionsConsideredForInterfaces.length > 0) {
            interfaces.push(this.buildInterfaceDeclaration(
                interactionsConsideredForInterfaces,
                this.getInterfaceName(argument.argumentName),
                argument,
                functionRunTimeInfo
            ));
        }

        return interfaces;
    }

    private filterInteractionsForComputingInterfaces(interactions: RunTimeInfoUtils.InteractionRuntimeInfo[]) {
        return interactions.filter(
            v => { return (v.code === "getField") }
        );
    }

    private mergeArgumentTypeOfs(inputTypeOfs: string[], interfacesTypeOfs: string[]): string[] {
        if (interfacesTypeOfs.length > 0) {
            inputTypeOfs = inputTypeOfs.filter((val) => {
                return val !== "object";
            });
        }

        return inputTypeOfs.concat(interfacesTypeOfs);
    }

    private getInterfaceName(name: string): string {
        return "I__" + name;
    }

    private buildInterfaceDeclaration(
        interactions: RunTimeInfoUtils.InteractionRuntimeInfo[],
        name: string,
        argument: RunTimeInfoUtils.ArgumentRuntimeInfo,
        functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo
    ): InterfaceDeclaration {

        let interfaceDeclaration = new InterfaceDeclaration();

        interactions.forEach(interaction => {
            let interfaceAttribute : InterfaceAttributeDeclaration = {
                name: interaction.field,
                type: ""
            };

            let filteredFollowingInteractions : RunTimeInfoUtils.InteractionRuntimeInfo[] = [];
            if (interaction.followingInteractions) {
                filteredFollowingInteractions = this.filterInteractionsForComputingInterfaces(interaction.followingInteractions);
            }

            if (filteredFollowingInteractions.length > 0) {
                let followingInterfaceDeclaration = this.buildInterfaceDeclaration(
                    filteredFollowingInteractions,
                    this.getInterfaceName(interaction.field),
                    argument,
                    functionRunTimeInfo
                );

                interfaceAttribute.type = this.matchToTypescriptType(followingInterfaceDeclaration.name);
            } else {
                interfaceAttribute.type = this.matchToTypescriptType(interaction.returnTypeOf);
            }

            interfaceDeclaration.addAttribute(interfaceAttribute);
        });

        interfaceDeclaration.name = name;
        this.addInterfaceDeclaration(
            interfaceDeclaration,
            argument,
            functionRunTimeInfo
        );

        return interfaceDeclaration;
    }

    private addInterfaceDeclaration(interfaceDeclaration: InterfaceDeclaration, argument: RunTimeInfoUtils.ArgumentRuntimeInfo, functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo)
    : void
 {
        let serializedInterface = [interfaceDeclaration.name,
            argument.argumentIndex,
            argument.argumentName,
            functionRunTimeInfo.functionId
        ].join("__");

        if (serializedInterface in this.interfaceDeclarations) {
            this.interfaceDeclarations[serializedInterface].concatWith(interfaceDeclaration);
        } else {
            let interfaceName = interfaceDeclaration.name;
            while (interfaceName in this.interfaceNames) {
                this.interfaceNameCounter++;
                interfaceName = interfaceDeclaration.name + "__" + this.interfaceNameCounter;
            }
    
            interfaceDeclaration.name = interfaceName;
    
            this.interfaceNames[interfaceDeclaration.name] = true;
            this.interfaceDeclarations[serializedInterface] = interfaceDeclaration;
        }
    }

    private getInputTypeOfs(argument: RunTimeInfoUtils.ArgumentRuntimeInfo): string[] {
        return argument.interactions.filter(
            interaction => {
                return (interaction.code === "inputValue");
            }
        ).map(interaction => {
            return this.matchToTypescriptType(interaction.typeof);
        });
    }

    private matchToTypescriptType(t: string): string {
        let m: { [id: string] : string; } = {
            "string": "string",
            "number": "number",
            "undefined": "undefined",
            "null": "null",
            "object": "object",
            "array": "Array<any>",
            "boolean": "boolean",
            "function": "Function",
        };

        if (!(t in m)) {
            return t;
        }

        return m[t];
    }

    private matchReturnTypeOfs(t: string): string {
        let m: { [id: string]: string; } = {
            "string": "string",
            "number": "number",
            "undefined": "void",
            "null": "null",
            "object": "object",
            "array": "Array<any>",
            "boolean": "boolean",
            "function": "Function",
        };

        if (!(t in m)) {
            return t;
        }

        return m[t]; 
    }
}