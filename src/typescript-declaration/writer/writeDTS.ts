import { emit } from '../ts-ast-utils/utils';
import { buildAst } from '../ast/buildAst';
import path from 'path';
import { DTS } from '../ast/types';
import { promises as fs } from 'fs';

export const writeDTS = async (dts: DTS, fileName: string) => {
  const filePath = path.dirname(fileName);

  await fs.mkdir(filePath, { recursive: true });
  await fs.writeFile(fileName, emit(buildAst(dts)));
};
