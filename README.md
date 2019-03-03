## TypeScript declaration file generator

### Installation
#### Docker
Install Docker.
https://docs.docker.com/install/

#### Build Docker image

```shell
git clone https://fcristiani@bitbucket.org/fcristiani/ts-declaration-file-generator.git

cd ts-declaration-file-generator
```

```shell
./build/build.sh
```

This will build an image called `ts-declaration-file-generator` on your local machine.

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
You can use the example provided in this repo under `example/output.json`.

```shell
docker run --name generate-declaration-file -v $(pwd)/example/output.json:/tmp/output.json tsd-generator --module-name calculator -i /tmp/output.json
```

```shell
docker cp generate-declaration-file:/usr/local/app/output/. /tmp/ts-declaration-file
```

```shell
docker rm generate-declaration-file
```

You will find the declaration file under `/tmp/ts-declaration-file/calculator/index.d.ts`:

```typescript
export = calculator

declare namespace calculator {
        export function sum(a: number, b: number): number
}
```