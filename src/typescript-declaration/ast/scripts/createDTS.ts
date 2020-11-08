/* eslint-disable no-console */
import { DTS, DTSTypeKinds, DTSTypeKeywords } from '../types';
import { buildAst } from '../buildAst';
import { emit } from '../../ts-ast-utils/utils';

/*

export = Calculator;

declare class Calculator {
  constructor(calculatorName: string);
  sum(a: number, b: number, optionalParameter?: Calculator.I__optionalParameter): number;
}

declare namespace Calculator {
  export interface I__optionalParameter {
    hello?: number;
    world: number;
  }
}

 */

const dts: DTS = {
  exportAssignment: 'Calculator',
  classes: [
    {
      name: 'Calculator',
      constructors: [
        {
          parameters: [
            {
              name: 'calculatorName',
              type: {
                kind: DTSTypeKinds.KEYWORD,
                value: DTSTypeKeywords.STRING,
              },
            },
          ],
        },
      ],
      methods: [
        {
          name: 'sum',
          parameters: [
            {
              name: 'a',
              type: {
                kind: DTSTypeKinds.KEYWORD,
                value: DTSTypeKeywords.NUMBER,
              },
            },
            {
              name: 'b',
              type: {
                kind: DTSTypeKinds.KEYWORD,
                value: DTSTypeKeywords.NUMBER,
              },
            },
            {
              name: 'optionalParameter',
              type: {
                kind: DTSTypeKinds.TYPE_REFERENCE,
                value: {
                  referenceName: 'I__optionalParameter',
                  namespace: 'Calculator',
                },
              },
              optional: true,
            },
          ],
          returnType: {
            kind: DTSTypeKinds.KEYWORD,
            value: DTSTypeKeywords.NUMBER,
          },
        },
      ],
    },
  ],
  namespace: {
    name: 'Calculator',
    interfaces: [
      {
        name: 'I__optionalParameter',
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
  },
};

const ast = buildAst(dts);

console.log(emit(ast));
