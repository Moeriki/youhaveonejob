import { render } from '@testing-library/react';
import React from 'react';

import { Job } from '../../data/job';
import { Sticky } from './sticky';

describe('Sticky', () => {
  it('should render successfully', () => {
    const JOB: Job = { id: 1, description: 'Hello World!' };
    const { baseElement } = render(<Sticky currentJob={JOB} />);
    expect(baseElement).toBeTruthy();
  });
});
