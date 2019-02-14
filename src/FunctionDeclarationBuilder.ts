import { FunctionDeclaration, ArgumentDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";
import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import { InterfaceDeclaration, InterfaceAttributeDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';

export class FunctionDeclarationBuilder {
    reader: RunTimeInfoUtils.RuntimeInfoReader;
    interfaceNames: { [id: string]: boolean };
    interfaceDeclarations : { [id: string] : InterfaceDeclaration; };
    interfaceNameCounter : number;

    constructor(reader: RunTimeInfoUtils.RuntimeInfoReader) {
        this.reader = reader;
        this.interfaceNames = {}
        this.interfaceDeclarations = {};
        this.interfaceNameCounter = 0;
    };

    getInterfaceDeclarations(): InterfaceDeclaration[] {
        let i : InterfaceDeclaration[] = [];

        for (let k in this.interfaceDeclarations) {
            i.push(this.interfaceDeclarations[k]);
        }

        return i;
    }

    buildAll(): FunctionDeclaration[] {
        let runTimeInfo = this.reader.read();

        let functionDeclarations: FunctionDeclaration[] = [];
        for (let key in runTimeInfo) {
            functionDeclarations = functionDeclarations.concat(this.build(runTimeInfo[key]));
        }

        return functionDeclarations;
    }

    private build(functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo) : FunctionDeclaration[] {
        let functionDeclarations: FunctionDeclaration[] = [];

        for (const traceId in functionRunTimeInfo.args) {
            let functionDeclaration = new FunctionDeclaration();
            functionDeclaration.name = functionRunTimeInfo.functionName;
            functionDeclaration.addReturnTypeOf(functionRunTimeInfo.returnTypeOfs[traceId]);

            if (functionRunTimeInfo.args.hasOwnProperty(traceId)) {
                const argumentInfo = functionRunTimeInfo.args[traceId];
                argumentInfo.forEach(argument => {
                    let argumentDeclaration = new ArgumentDeclaration(
                        argument.argumentIndex,
                        argument.argumentName
                    );

                    this.mergeArgumentTypeOfs(
                        this.getInputTypeOfs(argument),
                        this.getInterfacesTypeOfs(argument, functionRunTimeInfo)
                    ).forEach(typeOf => {
                        argumentDeclaration.addTypeOf(typeOf);
                    });

                    functionDeclaration.addArgument(argumentDeclaration);
                });
            }

            functionDeclarations.push(functionDeclaration);
        }

        return functionDeclarations;
    }

    private getInterfacesTypeOfs(argument: RunTimeInfoUtils.ArgumentRuntimeInfo, functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo): string[] {
        let interfacesTypeOfs : string[] = [];
        let interactionsConsideredForInterfaces = this.filterInteractionsForComputingInterfaces(argument.interactions);

        if (interactionsConsideredForInterfaces.length > 0) {
            let interfaceDeclaration = this.buildInterfaceDeclaration(
                interactionsConsideredForInterfaces,
                this.getInterfaceName(argument.argumentName),
                argument,
                functionRunTimeInfo
            );

            interfacesTypeOfs.push(interfaceDeclaration.name);
        }

        return interfacesTypeOfs;
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

                interfaceAttribute.type = followingInterfaceDeclaration.name;
            } else {
                interfaceAttribute.type = interaction.returnTypeOf;
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
}