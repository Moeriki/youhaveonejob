import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
} from 'formik';
import styled from 'styled-components';

import { Layout } from '../components/layout';
import { Button, GhostButton } from '../components/button/button';
import { Sticky } from '../components/sticky/sticky';
import {
  CompleteJobInput,
  CreateJobInput,
  useCompleteJob,
  useCreateJob,
  useGetJobs,
} from '../data/job';

const StyledWorkArea = styled.div`
  position: relative;
  height: 250px;

  .error {
    color: red;
    text-align: center;
  }

  .no-sticky,
  .sticky {
    position: absolute;
    width: 250px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  .no-sticky {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
`;

const StyledBottom = styled.div`
  padding: 2em;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      margin: 0.5em 0;
      background-color: #fff;
      border: 0;
      border-bottom: 2px solid var(--rich-black-fogra-39);
      font-size: 24px;
      padding: 0.25em;
      width: min(100%, 20ch);
      &:focus {
        outline: 0.5px solid var(--eerie-black);
      }
      &::placeholder {
        color: var(--eerie-black);
      }
    }

    button {
      font-size: 16px;
    }
  }
`;

export function Index() {
  const [completeJob, completeJobMutation] = useCompleteJob();
  const [createJob, createJobMutation] = useCreateJob();
  const jobsQuery = useGetJobs();

  const handleCompleteJob = async ({ id }: CompleteJobInput) => {
    await completeJob({ variables: { id } });
  };

  const handleCreateJobValidate = ({ description }: CreateJobInput) => {
    const errors: FormikErrors<CreateJobValues> = {};
    if (description.trim() === '') {
      errors.description = 'A description is required';
    }
    return errors;
  };

  const handleCreateJobSubmitForm = async (
    values: CreateJobInput,
    { resetForm }: FormikHelpers<CreateJobInput>
  ): Promise<void> => {
    const result = await createJob({ variables: values });
    resetForm();
    jobsQuery.refetch();
  };

  const firstJob =
    jobsQuery.data == null
      ? undefined
      : jobsQuery.data.jobs.filter((job) => !job.completed)[0];

  return (
    <Layout jobCount={jobsQuery.data?.jobs.length ?? 0}>
      <StyledWorkArea>
        {jobsQuery.error && (
          <p className="error">
            Could not load jobs: {jobsQuery.error.message}
          </p>
        )}
        {completeJobMutation.error && (
          <p className="error">
            Could not complete job: {completeJobMutation.error.message}
          </p>
        )}
        {createJobMutation.error && (
          <p className="error">
            Could not create job: {createJobMutation.error.message}
          </p>
        )}
        {jobsQuery.loading ? (
          <div className="no-sticky">...</div>
        ) : firstJob == null ? (
          <div className="no-sticky">And you did it.</div>
        ) : (
          <div className="sticky">
            <Sticky
              currentJob={firstJob}
              onComplete={() => handleCompleteJob(firstJob)}
            />
          </div>
        )}
      </StyledWorkArea>
      <StyledBottom>
        <Formik
          initialValues={{ description: '' }}
          onSubmit={handleCreateJobSubmitForm}
          validate={handleCreateJobValidate}
        >
          <Form>
            <Field placeholder="What to do?" name="description"></Field>
            <GhostButton type="submit" disabled={createJobMutation.loading}>
              Create Job
            </GhostButton>
          </Form>
        </Formik>
      </StyledBottom>
    </Layout>
  );
}

export default Index;
