import * as fs from 'fs';
import * as FunctionDeclaration from "./FunctionDeclaration";

export class DeclarationFileWriter {
    moduleName: string;
    outputDirectory: string;

    constructor(moduleName: string) {
        this.moduleName = moduleName;
        this.outputDirectory = "output";
    }

    write(functionDeclarations: FunctionDeclaration.FunctionDeclaration[]) {
        let filePath = this.outputDirectory + "/" + this.moduleName;
        let fileName = filePath + "/index.d.ts";
        this.cleanOutput(filePath, fileName);
        
        fs.appendFileSync(
            fileName,
            "export = " + this.moduleName + "\n"
        );
        
        fs.appendFileSync(
            fileName,
            "declare namespace " + this.moduleName + " {"  + "\n"
        );
        
        functionDeclarations.forEach(functionDeclaration => {
            let argumentsWithType = functionDeclaration.arguments.map(argument => {
                return argument.name + ": " + argument.differentTypeOfs.join("|"); 
            }).join(", ");
        
            fs.appendFileSync(
                fileName,
                "\texport function " + functionDeclaration.name + "(" + argumentsWithType + "): " + functionDeclaration.differentReturnTypeOfs.join("|") + "\n"
            );
        });
        
        fs.appendFileSync(
            fileName,
            "}"
        );
    }

    private cleanOutput(filePath: string, fileName: string) : void {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    }
}