import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from '@apollo/client';
import { AppProps } from 'next';
import React, { ReactElement, useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* General */
    --rich-black-fogra-39: hsla(330, 10%, 4%, 1);
    --eerie-black: hsla(206, 14%, 10%, 1);
    --blood-red: hsla(359, 87%, 21%, 1);
    --ruby-red: hsla(358, 76%, 36%, 1);
    --carnelian: hsla(359, 77%, 41%, 1);
    --imperial-red: hsla(359, 77%, 56%, 1);
    --silver-chalice: hsla(5, 7%, 67%, 1);
    --light-gray: hsla(0, 0%, 83%, 1);
    --cultured: hsla(330, 9%, 96%, 1);
    --white: hsla(0, 0%, 100%, 1);

    /* Pastel */
    --light-pink: hsla(0, 100%, 84%, 1);
    --deep-champagne: hsla(33, 100%, 82%, 1);
    --lemon-yellow-crayola: hsla(62, 100%, 86%, 1);
    --tea-green: hsla(110, 100%, 87%, 1);
    --celeste: hsla(185, 100%, 80%, 1);
    --baby-blue-eyes: hsla(217, 100%, 81%, 1);
    --maximum-blue-purple: hsla(249, 100%, 85%, 1);
    --mauve: hsla(300, 100%, 89%, 1);
    --baby-powder: hsla(60, 100%, 99%, 1);

    /* Productivity */
    --flickr-pink: hsla(333, 93%, 56%, 1);
    --byzantine: hsla(309, 77%, 40%, 1);
    --purple: hsla(276, 91%, 38%, 1);
    --purple-2: hsla(268, 88%, 36%, 1);
    --trypan-blue: hsla(263, 87%, 35%, 1);
    --trypan-blue-2: hsla(258, 86%, 34%, 1);
    --persian-blue: hsla(243, 57%, 50%, 1);
    --ultramarine-blue: hsla(229, 83%, 60%, 1);
    --dodger-blue: hsla(212, 84%, 61%, 1);
    --vivid-sky-blue: hsla(194, 85%, 62%, 1);
  }

  html,
  body {
    margin: 0;
    box-sizing: border-box;
    color: var(--rich-black-fogra-39);
  }

  * {
    box-sizing: inherit;
    font-family: sans-serif;
  }
`;

let apolloClient: ApolloClient | undefined;

function createClient(): ApolloClient {
  return new ApolloClient({
    cache: new InMemoryCache(),
    ssrMode: typeof window === 'undefined',
    uri: process.env.NEXT_PUBLIC_API_URL,
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
      <GlobalStyle />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
