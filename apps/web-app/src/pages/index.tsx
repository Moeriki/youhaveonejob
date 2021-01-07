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

const StyledPage = styled.div`
  .error {
    color: red;
  }
`;

interface Job {
  id: number;
  completed: boolean;
  description: string;
}

interface CreateJobValues {
  description: string;
}

const COMPLETE_JOB = gql`
  mutation CompleteJob($id: Int!) {
    completeJob(id: $id) {
      id
      completed
    }
  }
`;

const CREATE_JOB = gql`
  mutation CreateJob($description: String!) {
    createJob(description: $description) {
      id
      completed
      description
    }
  }
`;

const GET_JOBS = gql`
  query GetJobs {
    jobs(completed: false) {
      id
      completed
      description
    }
  }
`;

export function Index() {
  const [createJob, createJobMutation] = useMutation<
    { job: Job },
    { description: string }
  >(CREATE_JOB);
  const [completeJob, completeJobMutation] = useMutation<
    { job: { id: string } },
    { id: number }
  >(COMPLETE_JOB);
  const jobsQuery = useQuery<{ jobs: Job[] }, { completed: boolean }>(GET_JOBS);

  const handleCompleteJob = async (id: number) => {
    await completeJob({ variables: { id } });
  };

  const handleCreateJobValidate = (values: CreateJobValues) => {
    const errors: FormikErrors<CreateJobValues> = {};
    if (values.description.trim() === '') {
      errors.description = 'A description is required';
    }
    return errors;
  };

  const handleCreateJobSubmitForm = async (
    values: CreateJobValues,
    { resetForm }: FormikHelpers<CreateJobValues>
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
    <StyledPage>
      <h1>You Have One Job!</h1>
      {jobsQuery.error && (
        <p className="error">Could not load jobs: {jobsQuery.error}</p>
      )}
      <p>
        {jobsQuery.loading ? (
          '...'
        ) : firstJob == null ? (
          'You have no jobs'
        ) : (
          <>
            {firstJob.description}
            <button
              type="button"
              onClick={() => handleCompleteJob(firstJob.id)}
            >
              Complete
            </button>
            {completeJobMutation.error}
          </>
        )}
      </p>
      <h2>Create new job</h2>
      <Formik
        initialValues={{ description: '' }}
        onSubmit={handleCreateJobSubmitForm}
        validate={handleCreateJobValidate}
      >
        <Form>
          <label htmlFor="description">What do you need to do?</label>
          <div className="error">
            <ErrorMessage name="description" />
          </div>
          <Field as="textarea" name="description"></Field>
          <button type="submit" disabled={createJobMutation.loading}>
            Create Job
          </button>
        </Form>
      </Formik>
    </StyledPage>
  );
}

export default Index;
