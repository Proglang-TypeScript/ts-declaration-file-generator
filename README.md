## TypeScript declaration file generator

### Installation
#### Docker
Install Docker.
https://docs.docker.com/install/

#### Build Docker image

Clone this repository and then run:

```shell
./build/build.sh
```

This will build an image called `tsd-generator` on your local machine.

### Usage
#### Get runtime information from one JS file
Run the docker container mounting your runtime information file on /tmp/output.json.

```shell
docker run \
	--name generate-declaration-file \
	-v FILE_RUNTIME_INFO:/tmp/output.json \
	tsd-generator \
	--module-name MyModule -i /tmp/output.json
```

You still need to retrieve the declaration file from the container.

```shell
docker cp generate-declaration-file:/usr/local/app/output/. YOUR_PATH
```

#### Example
You can use the example provided in this repo under `examples/calculator/output.json`, which corresponds to the file `examples/calculator/calculator.js`.

```shell
docker run --name generate-declaration-file -v $(pwd)/examples/calculator/output.json:/tmp/output.json tsd-generator --module-name calculator -i /tmp/output.json
```

```shell
docker cp generate-declaration-file:/usr/local/app/output/. /tmp/ts-declaration-file
```

```shell
docker rm generate-declaration-file
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