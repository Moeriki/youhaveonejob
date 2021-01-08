import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from '@apollo/client';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { ReactElement, useMemo } from 'react';

import './app.css';

let apolloClient: ApolloClient | undefined;

function createClient(): ApolloClient {
  return new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
    uri: 'http://localhost:4000',
  });
}

function initializeClient(initialState = null): ApolloClient {
  const client = apolloClient ?? createClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = client.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    client.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return client;
  }

  // Create the Apollo Client once in the client
  if (apolloClient == null) {
    apolloClient = client;
  }

  return client;
}

export function useClient(initialState) {
  return useMemo(() => initializeClient(initialState), [initialState]);
}

export default function Application({
  Component,
  pageProps,
}: AppProps): ReactElement {
  const client = useClient(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
