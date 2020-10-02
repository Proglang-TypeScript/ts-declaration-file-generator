import { RuntimeInfoParser } from '../RunTimeInfoParser';

describe('RunTimeInfoParser', () => {
  it('parses an empty runtime-info file', () => {
    const parser = new RuntimeInfoParser(`${__dirname}/files/basic.json`);
    const parsedContent = parser.parse();

    expect(parsedContent['functionId_1'].args).toStrictEqual({});
    expect(parsedContent['functionId_1'].constructedBy).toStrictEqual('');
    expect(parsedContent['functionId_1'].functionId).toBe('functionId_1');
    expect(parsedContent['functionId_1'].functionIid).toBe('some-functionIid');
    expect(parsedContent['functionId_1'].functionName).toBe('foo');
    expect(parsedContent['functionId_1'].isConstructor).toBe(false);
    expect(parsedContent['functionId_1'].isExported).toBe(true);
    expect(parsedContent['functionId_1'].requiredModule).toBe('./bar');
    expect(parsedContent['functionId_1'].returnTypeOfs).toStrictEqual({});
  });

  it('aggregates the args based on the traceId', () => {
    const parser = new RuntimeInfoParser(`${__dirname}/files/with-args.json`);
    const parsedContent = parser.parse();

    const functionInfo = parsedContent['functionId_3'];
    expect(functionInfo.args['trace__2']).toHaveLength(2);
    expect(functionInfo.args['trace__4']).toHaveLength(2);

    expect(functionInfo.args['trace__2'][0].argumentName).toBe('firstName');
    expect(functionInfo.args['trace__2'][1].argumentName).toBe('lastName');
    expect(functionInfo.args['trace__2'][0].interactions).toHaveLength(1);
    expect(functionInfo.args['trace__2'][1].interactions).toHaveLength(1);

    expect(functionInfo.args['trace__4'][0].argumentName).toBe('firstName');
    expect(functionInfo.args['trace__4'][0].interactions).toHaveLength(3);
    expect(functionInfo.args['trace__4'][1].argumentName).toBe('lastName');
    expect(functionInfo.args['trace__4'][1].interactions).toHaveLength(4);
  });

  it('aggregates the returnTypeOfs based on the traceId', () => {
    const parser = new RuntimeInfoParser(`${__dirname}/files/with-return-typeofs.json`);
    const parsedContent = parser.parse();

    const functionInfo = parsedContent['functionId_3'];
    expect(functionInfo.returnTypeOfs['trace__2']).toBe('string');
    expect(functionInfo.returnTypeOfs['trace__4']).toBe('number');
  });
});
