import { FunctionDeclaration, ArgumentDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";
import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import { InterfaceDeclaration, InterfaceAttributeDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';

export class FunctionDeclarationBuilder {
    reader: RunTimeInfoUtils.RuntimeInfoReader;
    interfaceNames: { [id: string]: InterfaceDeclaration };
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
                        this.getInterfacesTypeOfs(argument)
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

    private getInterfacesTypeOfs(argument: RunTimeInfoUtils.ArgumentRuntimeInfo): string[] {
        let interfacesTypeOfs : string[] = [];
        let interactionsConsideredForInterfaces = this.filterInteractionsForComputingInterfaces(argument.interactions);

        let interfaceDeclaration = this.buildInterfaceDeclaration(interactionsConsideredForInterfaces);

        if (!interfaceDeclaration.isEmpty()) {
            interfaceDeclaration.name = this.getInterfaceName(argument.argumentName);

            this.addInterfaceDeclaration(interfaceDeclaration);
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

    private buildInterfaceDeclaration(interactions: RunTimeInfoUtils.InteractionRuntimeInfo[]): InterfaceDeclaration {
        let interfaceDeclaration = new InterfaceDeclaration();

        let interfaces : { [id: string] : InterfaceDeclaration; } = {};
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
                let followingInterfaceDeclaration = this.buildInterfaceDeclaration(filteredFollowingInteractions);
                followingInterfaceDeclaration.name = this.getInterfaceName(interaction.field);

                if (!(followingInterfaceDeclaration.name in interfaces)) {
                    interfaces[followingInterfaceDeclaration.name] = followingInterfaceDeclaration;
                    this.addInterfaceDeclaration(followingInterfaceDeclaration);
                } else {
                    interfaces[followingInterfaceDeclaration.name].concatWith(followingInterfaceDeclaration);
                }

                interfaceAttribute.type = followingInterfaceDeclaration.name;
            } else {
                interfaceAttribute.type = interaction.returnTypeOf;
            }

            interfaceDeclaration.addAttribute(interfaceAttribute);
        });

        return interfaceDeclaration;
    }

    private addInterfaceDeclaration(interfaceDeclaration: InterfaceDeclaration): void {
        let serializedInterface = JSON.stringify(interfaceDeclaration);

        if (!(serializedInterface in this.interfaceDeclarations)) {
            if (interfaceDeclaration.name in this.interfaceNames) {
                let alreadyExistingInterface = this.interfaceNames[interfaceDeclaration.name];
                if(this.mergeInterfaces(alreadyExistingInterface, interfaceDeclaration)) {
                    return;
                };
            }

            let interfaceName = interfaceDeclaration.name;
            while (interfaceName in this.interfaceNames) {
                this.interfaceNameCounter++;
                interfaceName = interfaceDeclaration.name + "__" + this.interfaceNameCounter;
            }

            interfaceDeclaration.name = interfaceName;

            this.interfaceNames[interfaceDeclaration.name] = interfaceDeclaration;
            this.interfaceDeclarations[serializedInterface] = interfaceDeclaration;
        }
    }

    private mergeInterfaces(alreadyExistingInterface: InterfaceDeclaration, newInterface: InterfaceDeclaration, ): boolean {
        let merged = false;

        let attributesAlreadyExistingInterfaces = alreadyExistingInterface.getAttributesNames();
        let attributesNewInterfaces = newInterface.getAttributesNames();

        if (attributesAlreadyExistingInterfaces.toString() === attributesNewInterfaces.toString()) {
            alreadyExistingInterface.intersectWith(newInterface);

            merged = true;
        }

        return merged;
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