import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from '@apollo/client';
import React from 'react';

import './app.css'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000',
});

export default function Application({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
