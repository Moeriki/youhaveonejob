import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikErrors } from 'formik';
import styled from 'styled-components';

const StyledPage = styled.div`
  .error {
    color: red;
  }
`;

interface CreateJobValues {
  description: string;
}

const CREATE_JOB = gql`
  mutation CreateJob($description: String!) {
    createJob(description: $description) {
      id
      description
    }
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
  const [createJob, createJobMutation] = useMutation(CREATE_JOB);
  const { error, data, loading } = useQuery(GET_JOBS);

  const handleCreateJobValidate = (values: CreateJobValues) => {
    const errors: FormikErrors<CreateJobValues> = {};
    if (values.description.trim() === '') {
      errors.description = 'A description is required';
    }
    return errors;
  };

  const handleCreateJobSubmitForm = async (
    values: CreateJobValues
  ): Promise<void> => {
    createJob({ variables: values });
  };

  const firstJob = data?.jobs?.[0];

  return (
    <StyledPage>
      <h1>You Have One Job!</h1>
      {error && <p className="error">Could not load jobs: {error}</p>}
      <p>
        {loading
          ? '...'
          : firstJob == null
          ? 'You have no jobs'
          : firstJob.description}
      </p>
      <h2>Create new job</h2>
      <Formik
        initialValues={{ description: '' }}
        onSubmit={handleCreateJobSubmitForm}
        validate={handleCreateJobValidate}
      >
        <Form>
          <label htmlFor="description">What do you need to do?</label>
          <div className="error"><ErrorMessage name="description" /></div>
          <Field
            as="textarea"
            name="description"
          ></Field>
          <button type="submit" disabled={createJobMutation.loading}>
            Create Job
          </button>
        </Form>
      </Formik>
    </StyledPage>
  );
}

export default Index;
