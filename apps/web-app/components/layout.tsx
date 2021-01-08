import React from 'react';
import styled from 'styled-components';

const StyledLayout = styled.div`
  height: 100vh;
  margin: 0 1em;

  header {
    display: flex;
    height: 200px;
    align-items: center;
    justify-content: center;

    h1 {
      max-width: 10ch;
      text-transform: uppercase;

      div {
        color: var(--silver-chalice);
        text-align: center;
      }
      div:first-child {
        font-weight: 100;
      }
    }
  }

  main {
    width: 100%;
  }
`;

interface Props {
  children: React.ReactNode;
  jobCount: number;
}

export function Layout({ children, jobCount }: Props): React.ReactElement {
  return (
    <StyledLayout>
      <header>
        <h1>
          <div>You {jobCount ? 'Have' : 'Had'}</div>
          <div>One Job!</div>
        </h1>
      </header>
      <main>{children}</main>
    </StyledLayout>
  );
}
