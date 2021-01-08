import React from 'react';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ButtonProps {
  children: React.ReactNode;
}

const StyledButton = styled.button`
  padding: 0.5em;
  border: 0;
  border-radius: 5px;
  background-color: var(--tea-green);
  color: var(--flickr-pink);
`;

export const Button = StyledButton;

const StyledGhostButton = styled(StyledButton)`
  background-color: transparent;
  border: 0.5px solid var(--flickr-pink);
`;

export const GhostButton = StyledGhostButton;

export default StyledButton;
