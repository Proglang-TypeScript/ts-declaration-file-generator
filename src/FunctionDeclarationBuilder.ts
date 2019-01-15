import * as FunctionDeclaration from "./TypescriptDeclaration/FunctionDeclaration";
import { FunctionRuntimeInfo, InteractionRuntimeInfo, ArgumentRuntimeInfo } from "./RunTimeInfoUtils";
import { InterfaceDeclaration, InterfaceAttributeDeclaration } from './TypescriptDeclaration/InterfaceDeclaration';

export class FunctionDeclarationBuilder {
    interfaceDeclarations: InterfaceDeclaration[];

    constructor() {
        this.interfaceDeclarations = [];
    };

    build(functionRunTimeInfo: FunctionRuntimeInfo) : FunctionDeclaration.FunctionDeclaration {
        let functionDeclaration = new FunctionDeclaration.FunctionDeclaration();
        functionDeclaration.name = functionRunTimeInfo.functionName;
        functionDeclaration.differentReturnTypeOfs = this.getDifferentReturnTypeOfs(functionRunTimeInfo);
    
        functionRunTimeInfo.args.forEach(argument => {
            let interactionsConsideredForInterfaces = argument.interactions.filter(
                v => {return (v.code === "getField")}
            );

            let differentReturnTypeOfs = this.getDifferentInputTypeOfs(argument);
            let interfaceDeclaration = this.buildInterfaceDeclaration(interactionsConsideredForInterfaces);

            if (!interfaceDeclaration.isEmpty()) {
                interfaceDeclaration.name = this.getInterfaceName(argument);
    
                this.interfaceDeclarations.push(interfaceDeclaration);
                differentReturnTypeOfs.push(interfaceDeclaration.name);
                differentReturnTypeOfs = this.removeTypeOfObjectWhenItHasAnInterface(differentReturnTypeOfs);
            }

            let argumentDeclaration : FunctionDeclaration.ArgumentDeclaration = {
                index: argument.argumentIndex,
                name: argument.argumentName,
                differentTypeOfs: differentReturnTypeOfs
            };
    
            functionDeclaration.addArgument(argumentDeclaration);
        });

        return functionDeclaration;
    }

    private getInterfaceName(argument: ArgumentRuntimeInfo): string {
        return "Interface__" + argument.argumentName + "__" + Math.ceil(Math.random()*1000);
    }
    private buildInterfaceDeclaration(interactions: InteractionRuntimeInfo[]): InterfaceDeclaration {
        let interfaceDeclaration = new InterfaceDeclaration();

        let interfaces : { [id: string] : InterfaceDeclaration; } = {};
        interactions.forEach(interaction => {
            let interfaceAttribute : InterfaceAttributeDeclaration = {
                name: interaction.field,
                type: ""
            };

            if (interaction.followingInteractions.length > 0) {
                let followingInterfaceDeclaration = this.buildInterfaceDeclaration(interaction.followingInteractions);
                followingInterfaceDeclaration.name = "Interface__" + interaction.field + "__" + Math.ceil(Math.random()*1000);

                if (!(interaction.field in interfaces)) {
                    interfaces[interaction.field] = followingInterfaceDeclaration;
                    this.interfaceDeclarations.push(followingInterfaceDeclaration);
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

    private removeTypeOfObjectWhenItHasAnInterface(differentReturnTypeOfs: string[]): string[] {
        return differentReturnTypeOfs.filter((val) => {
            return val !== "object";
        });
    }

    private getDifferentInputTypeOfs(argument: ArgumentRuntimeInfo): string[] {
        let matchedReturnTypeOfs: string[] = argument.interactions.filter(
            interaction => {
                return (interaction.code === "inputValue");
            }
        ).map(interaction => {
            return this.matchToTypescriptType(interaction.typeof);
        });

        return this.removeDuplicates(matchedReturnTypeOfs);
    }

    private getDifferentReturnTypeOfs(functionRunTimeInfo: FunctionRuntimeInfo) : string[] {
        let matchedReturnTypeOfs: string[] = functionRunTimeInfo.returnTypeOfs.map(returnTypeOf => {
            return this.matchToTypescriptType(returnTypeOf);
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