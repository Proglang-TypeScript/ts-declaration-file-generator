import { FunctionDeclaration, ArgumentDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";
import * as RunTimeInfoUtils from './RunTimeInfoUtils';
import { InterfaceDeclaration, InterfaceAttributeDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';

export class FunctionDeclarationBuilder {
    interfaceNames: { [id: string]: boolean };
    interfaceDeclarations : { [id: string] : InterfaceDeclaration; };
    interfaceNameCounter : number;
    reader: RunTimeInfoUtils.RuntimeInfoReader;

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

    build(functionRunTimeInfo: RunTimeInfoUtils.FunctionRuntimeInfo) : FunctionDeclaration[] {
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

                    argumentDeclaration.typeOfs = this.mergeArgumentTypeOfs(
                        this.getDifferentInputTypeOfs(argument),
                        this.getInterfacesTypeOfs(argument)
                    );

                    functionDeclaration.addArgument(argumentDeclaration);
                });
            }

            functionDeclarations.push(functionDeclaration);
        }

        return functionDeclarations;
    }

    private getInterfacesTypeOfs(argument: RunTimeInfoUtils.ArgumentRuntimeInfo): string[] {
        let interfacesTypeOfs : string[] = [];
        let interactionsConsideredForInterfaces = argument.interactions.filter(
            v => { return (v.code === "getField") }
        );

        let interfaceDeclaration = this.buildInterfaceDeclaration(interactionsConsideredForInterfaces);

        if (!interfaceDeclaration.isEmpty()) {
            interfaceDeclaration.name = this.getInterfaceName(argument.argumentName);

            this.addInterfaceDeclaration(interfaceDeclaration);
            interfacesTypeOfs.push(interfaceDeclaration.name);
        }

        return interfacesTypeOfs;
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

            if (interaction.followingInteractions.length > 0) {
                let followingInterfaceDeclaration = this.buildInterfaceDeclaration(interaction.followingInteractions);
                followingInterfaceDeclaration.name = this.getInterfaceName(interaction.field);

                if (!(interaction.field in interfaces)) {
                    interfaces[interaction.field] = followingInterfaceDeclaration;
                    this.addInterfaceDeclaration(followingInterfaceDeclaration);
                } else {
                    interfaces[interaction.field].merge(followingInterfaceDeclaration);
                }

                interfaceAttribute.type = interfaces[interaction.field].name;                
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

    private getDifferentInputTypeOfs(argument: RunTimeInfoUtils.ArgumentRuntimeInfo): string[] {
        let matchedReturnTypeOfs: string[] = argument.interactions.filter(
            interaction => {
                return (interaction.code === "inputValue");
            }
        ).map(interaction => {
            return this.matchToTypescriptType(interaction.typeof);
        });

        return this.removeDuplicates(matchedReturnTypeOfs);
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

    private removeDuplicates(target: string[]) : string[] {
        let different : { [id: string] : boolean; } = {};
        target.forEach(i => {
            if (!(i in different)) {
                different[i] = true;
            }
        });

        return Object.keys(different);
    }
}