import { render } from '@testing-library/react';
import React from 'react';

import { Button, GhostButton } from './button';

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button />);
    expect(baseElement).toBeTruthy();
  });
});

describe('GhostButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GhostButton />);
    expect(baseElement).toBeTruthy();
  });
});
