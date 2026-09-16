import { TypescriptDeclarationBuilder } from '../TypescriptDeclarationBuilder';
import { RuntimeInfoParser } from '../../../runtime-info/parser/RunTimeInfoParser';
import { DTSTypeKinds } from '../../ast/types';
import { createFunction } from '../../dts/helpers/createDTSType';

describe('TypescriptDeclarationBuilder', () => {
  describe('optional parameters', () => {
    it('should mark the same argument as optional in all occurences of the function', () => {
      const builder = new TypescriptDeclarationBuilder();
      const dts = builder.build(
        new RuntimeInfoParser(`${__dirname}/files/optional-parameters/output.json`).parse(),
        'build-name',
      );

      dts.functions?.forEach((f) => {
        expect(f.parameters && f.parameters[1]?.optional).toBe(true);
      });
    });
  });

  it('falls back to Function for a self-referential callback signature', () => {
    const builder = new TypescriptDeclarationBuilder();
    const dts = builder.build(
      {
        exported: {
          functionId: 'exported',
          functionName: 'exported',
          isConstructor: false,
          args: {
            trace__1: [
              {
                argumentIndex: 0,
                argumentName: 'callback',
                interactions: [
                  {
                    code: 'inputValue',
                    traceId: 'trace__1',
                    typeof: 'function',
                    functionId: 'recursive',
                  },
                ],
              },
            ],
          },
          declarationEnclosingFunctionId: -1,
          returnTypeOfs: { trace__1: 'string' },
          declarationTraceIdsMatch: {},
          functionIid: 1,
          requiredModule: './recursive-callback',
          isExported: true,
          constructedBy: '',
        },
        recursive: {
          functionId: 'recursive',
          functionName: 'recursive',
          isConstructor: false,
          args: {
            trace__2: [
              {
                argumentIndex: 0,
                argumentName: 'callback',
                interactions: [
                  {
                    code: 'inputValue',
                    traceId: 'trace__2',
                    typeof: 'function',
                    functionId: 'recursive',
                  },
                ],
              },
            ],
          },
          declarationEnclosingFunctionId: 'exported',
          returnTypeOfs: { trace__2: 'string' },
          declarationTraceIdsMatch: { trace__1: ['trace__2'], trace__2: ['trace__2'] },
          functionIid: 2,
          requiredModule: '',
          isExported: false,
          constructedBy: '',
        },
      },
      'recursive-callback',
    );

    const callbackType = dts.functions?.[0]?.parameters?.[0]?.type;
    expect(callbackType?.kind).toBe(DTSTypeKinds.UNION);
    if (callbackType?.kind !== DTSTypeKinds.UNION) return;

    const recursiveSignature = callbackType.value[0];
    expect(recursiveSignature.kind).toBe(DTSTypeKinds.FUNCTION);
    if (recursiveSignature.kind !== DTSTypeKinds.FUNCTION) return;

    expect(recursiveSignature.value.parameters?.[0]?.type).toStrictEqual(createFunction());
  });
});
