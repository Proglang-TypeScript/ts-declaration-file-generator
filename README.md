## TypeScript declaration file generator | dts-generate
![build](https://github.com/proglang/ts-declaration-file-generator/workflows/build/badge.svg?branch=master)

A NodeJS tool that generates a Typescript declaration file using runtime information.

### Installation
Clone this repository and then run:
```shell
$ npm install
$ npm run build
$ npm link
```

A link will be created using `npm link` called `dts-generate`. For more info take a look at the `package.json` file.

#### Docker
Install Docker (https://docs.docker.com/install) and then run:

```shell
$ ./build/build.sh
```

This will build an image called `tsd-generator` on your local machine.

### Usage
After installing and building the app, you need to run:

```shell
$ dts-generate -i [FILE-RUNTIME-INFO] -m [MODULE-NAME] -o [OUTPUT-DIRECTORY]
```

If the `-o` option is not given, the default output directory is the current directory.

**Note:** The runtime info file needs to be generated before running this tool.

#### Docker
Run the docker container mounting your runtime information file on /tmp/output.json.

```shell
$ docker run \
	--name generate-declaration-file \
	-v FILE_RUNTIME_INFO:/tmp/output.json \
	tsd-generator \
	--module-name MyModule -i /tmp/output.json
```

You still need to retrieve the declaration file from the container.

```shell
$ docker cp generate-declaration-file:/usr/local/app/output/. YOUR_PATH
```

### Example
You can use the example provided in this repo under `examples/calculator/output.json`, which corresponds to the file `examples/calculator/calculator.js`.

```shell
$ dts-generate -i examples/calcuator/output.json -m calculator
```

This will generate the declaration file in the default output directory `./output`.

#### Docker
```shell
$ docker run --name generate-declaration-file -v $(pwd)/examples/calculator/output.json:/tmp/output.json tsd-generator --module-name calculator -i /tmp/output.json
```

```shell
$ docker cp generate-declaration-file:/usr/local/app/output/. /tmp/ts-declaration-file
```

```shell
$ docker rm generate-declaration-file
```

You will find the declaration file under `/tmp/ts-declaration-file/calculator/index.d.ts`:

```typescript
export = Calculator;

declare class Calculator {
	constructor();
	sum(a: number, b: number): number;
}

declare namespace Calculator {
}
```
