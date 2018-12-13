import * as fs from 'fs';

export class JsonFileReader {
    read(fileName: string) : Object {
        var jsonFile = fs.readFileSync("output.json");
        return JSON.parse(jsonFile.toString());
    }
}