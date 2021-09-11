import Button from '@/components/common/button/Button';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import * as NewGroupValidator from '@/validators/NewGroupValidator';
import { CreateGroupAPIRequest } from '@/services/apis/groups/GroupsAPIService';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { CompactDangerMessageBox } from '@/components/common/messagebox/MessageBox';
import { redirectIfAnonmyous } from '@/lib/redirects';
import { useUserGroups } from '@/hooks/useGroups';

const CreateGroupPage = () => {
  const router = useRouter();

  const { reloadGroups } = useUserGroups();

  const handleFormSubmit = async ({ name, description }: CreateGroupAPIRequest, { setSubmitting }: FormikHelpers<CreateGroupAPIRequest>) => {
    try {
      await apiService.groups.createGroup({ name, description });
      toaster.success('Group created successfully.');

      await reloadGroups();

      setTimeout(() => {
        router.push('/manage/groups');
      }, 1000);
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout hasContainer title="Create Group">
      <Formik
        initialValues={{ name: '', description: '' }}
        validate={NewGroupValidator.validate}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="name">Group name:</label>
              <Field name="name" />
              <ErrorMessage name="name" component={CompactDangerMessageBox} />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description:</label>
              <Field name="description" as="textarea" />
            </div>

            <div className="input-group">
              <Button type="submit" disabled={isSubmitting}>Create</Button>
            </div>
          </Form>
        )}
      </Formik>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);

  return {
    props: {}
  };
};

export default CreateGroupPage;
