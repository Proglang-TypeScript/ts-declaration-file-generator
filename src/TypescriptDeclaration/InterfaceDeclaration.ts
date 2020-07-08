import { FunctionDeclaration } from './FunctionDeclaration';

export interface InterfaceAttributeDeclaration {
    name: string,
    type: string[],
    optional?: boolean
}

export class InterfaceDeclaration {
    name: string = "";
    methods: FunctionDeclaration[] = [];    
    attributes: { [name: string] : string[] } = {}; 
    
    isEmpty() : boolean {
        return Object.keys(this.attributes).length === 0 && this.methods.length === 0;
    }

    concatWith(i: InterfaceDeclaration) : void {
        i.getAttributes().forEach(a => {
            this.addAttribute(a);
        });
    }

    addAttribute(attributeDeclaration: InterfaceAttributeDeclaration): void {
        if (!(attributeDeclaration.name in this.attributes)) {
            this.attributes[attributeDeclaration.name] = [];
        }

        this.attributes[attributeDeclaration.name] = this.attributes[attributeDeclaration.name].concat(attributeDeclaration.type);
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
                type: this.attributes[name],
		        optional: this.attributes[name].indexOf("undefined") > -1
            };

            attributes.push(attribute);
        }

        return attributes;
    }

    getAttributesNames() : string[] {
        return Object.keys(this.attributes).sort();
    }
}