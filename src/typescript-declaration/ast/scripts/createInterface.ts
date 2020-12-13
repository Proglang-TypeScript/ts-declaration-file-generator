/* eslint-disable no-console */
import { DTS, DTSTypeKinds, DTSTypeKeywords } from '../types';
import { buildAst } from '../buildAst';
import { emit } from '../../ts-ast-utils/utils';

const dts: DTS = {
  interfaces: [
    {
      name: 'HelloWorld',
      properties: [
        {
          name: 'hello',
          type: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.NUMBER,
          },
          optional: true,
        },
        {
          name: 'world',
          type: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.NUMBER,
          },
        },
      ],
    },
  ],
};

const ast = buildAst(dts);

console.log(emit(ast));
