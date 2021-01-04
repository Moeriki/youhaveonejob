import { ApolloServer } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';

import { createContext } from './app/context';
import { schema } from './app/schema';

if (process.env.NODE_ENV === 'development') {
  new ApolloServer({ context: createContext, schema }).listen(
    { port: 4000 },
    () =>
      console.log(
        `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-apollo-server#using-the-graphql-api`
      )
  );
} else {
  const server = new ApolloServerLambda({ context: createContext, schema });
  exports.handler = server.createHandler({
    cors: {
      credentials: true,
      origin: '*',
    },
  });
}
