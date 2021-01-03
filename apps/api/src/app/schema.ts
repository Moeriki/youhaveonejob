import * as path from 'path';

import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';

import * as types from './types';

const filepath = (filepath: string): string =>
  path.join(__dirname, '../../', filepath);

export const schema = makeSchema({
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  outputs: {
    schema: filepath('schema.graphql'),
    typegen: filepath('src/generated/nexus.d.ts'),
  },
  plugins: [
    nexusPrisma({
      outputs: { typegen: filepath('src/generated/nexus-prisma.d.ts') },
    }),
  ],
  sourceTypes: {
    modules: [{ alias: 'prisma', module: '@prisma/client' }],
  },
  types,
});
