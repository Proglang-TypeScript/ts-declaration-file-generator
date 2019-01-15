import { FunctionDeclaration } from './FunctionDeclaration';

export interface InterfaceAttributeDeclaration {
    name: string,
    type: string
}

export class InterfaceDeclaration {
    name: string = "";
    methods: FunctionDeclaration[] = [];    
    attributes: { [name: string] : string[] } = {}; 
    
    addAttribute(attributeDeclaration: InterfaceAttributeDeclaration): void {
        if (!(attributeDeclaration.name in this.attributes)) {
            this.attributes[attributeDeclaration.name] = [];
        }

        this.attributes[attributeDeclaration.name].push(attributeDeclaration.type);
        this.attributes[attributeDeclaration.name] = this.removeDuplicates(this.attributes[attributeDeclaration.name]);
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

    getAttributes() : InterfaceAttributeDeclaration[] {
        let attributes : InterfaceAttributeDeclaration[] = [];
        for (let name in this.attributes) {
            let attribute : InterfaceAttributeDeclaration = {
                name: name,
                type: this.attributes[name].join(" | ")
            };

            attributes.push(attribute);
        }

        return attributes;
    }
}