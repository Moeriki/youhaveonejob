import { gql, useMutation } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';

import { useCompleteJob } from '../../data/job';
import { Button } from '../button/button';

const StyledSticky = styled.div`
  position: relative;
  height: 100%;
  background-color: var(--lemon-yellow-crayola);
  border: 1px solid var(--eerie-black);

  > * {
    position: absolute;
  }

  .description {
    top: 50%;
    left: 1em;
    right: 1em;
    transform: translateY(-50%);
    font-size: 30px;
    font-family: arial black;
    font-weight: 900;
    line-height: 1;
    text-align: center;
  }

  .actions {
    right: 0;
    bottom: 0;
    margin: 0.5em;
    button {
      font-size: 18px;
    }
  }
`;

/* eslint-disable-next-line */
export interface StickyProps {
  currentJob: Job;
  onComplete: (id: number) => void;
}

export function Sticky({
  currentJob,
  onComplete,
}: StickyProps): React.ReactElement {
  return (
    <StyledSticky>
      <div className="description">{currentJob.description}</div>
      <div className="actions">
        <Button type="button" onClick={() => onComplete(currentJob.id)}>
          Complete
        </Button>
      </div>
    </StyledSticky>
  );
}
