import { useQuery, gql } from '@apollo/client';
import React, { useEffect } from 'react';
import styled from 'styled-components';

const StyledPage = styled.div`
  .error {
    color: red;
  }
`;

const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      description
    }
  }
`;

export function Index() {
  const { error, data, loading } = useQuery(GET_JOBS);

  useEffect(() => {
    if (error != null) {
      console.error(error);
    }
  }, [error]);

  const firstJob = data?.jobs?.[0];

  return (
    <StyledPage>
      <h1>You Have One Job!</h1>
      {error && <p className="error">Could not load jobs</p>}
      <p>
        {loading
          ? '...'
          : firstJob == null
          ? 'You have no jobs'
          : firstJob.description}
      </p>
    </StyledPage>
  );
}

export default Index;
