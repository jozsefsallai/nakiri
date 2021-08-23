import Button from '@/components/common/button/Button';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';

import * as NewMonitoredKeywordFormValidator from '@/validators/NewMonitoredKeywordFormValidator';
import { CreateMonitoredKeywordAPIRequest } from '@/services/apis/monitored-keywords/MonitoredKeywordsAPIService';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import MessageBox, { CompactDangerMessageBox, MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import Loading from '@/components/loading/Loading';

interface IEditMonitoredKeywordPageProps {
  id: string;
};

const EditMonitoredKeywordPage: React.FC<IEditMonitoredKeywordPageProps> = ({ id }) => {
  const [ entry, setEntry ] = useState<IMonitoredKeyword | null>(null);
  const [ error, setError ] = useState('');

  const router = useRouter();

  const handleFormSubmit = async ({ keyword, webhookUrl }: CreateMonitoredKeywordAPIRequest, { setSubmitting }: FormikHelpers<CreateMonitoredKeywordAPIRequest>) => {
    try {
      await apiService.monitoredKeywords.updateMonitoredKeyword(id, {
        keyword,
        guildId: entry.guildId,
        webhookUrl
      });

      toaster.success(`Updated keyword "${keyword}".`);

      setTimeout(() => {
        router.push('/manage/monitored-keywords');
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

  const fetchEntry = async () => {
    setEntry(null);
    setError('');

    try {
      const { entry } = await apiService.monitoredKeywords.getMonitoredKeyword(id);
      setEntry(entry);
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        setError(errors[message]);
        return;
      }

      setError(errors.INTERNAL_SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  return (
    <DashboardLayout hasContainer title="Update Monitored Keyword">
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}
      {!entry && !error.length && <Loading />}

      {entry && (
        <Formik
          initialValues={{ keyword: entry.keyword, webhookUrl: entry.webhookUrl, guildId: entry.guildId }}
          validate={NewMonitoredKeywordFormValidator.validate}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="input-group">
                <label htmlFor="keyword">Keyword:</label>
                <Field name="keyword" />
                <ErrorMessage name="keyword" component={CompactDangerMessageBox} />
              </div>

              <div className="input-group">
                <label htmlFor="webhookUrl">Webhook URL:</label>
                <Field name="webhookUrl" />
                <ErrorMessage name="webhookUrl" component={CompactDangerMessageBox} />
              </div>

              <div className="input-group">
                <Button type="submit" disabled={isSubmitting}>Save</Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  await redirectIfDoesNotHavePermission(req, res, UserPermissions.MANAGE_MONITORED_KEYWORDS);

  const { id } = query;

  return {
    props: {
      id
    }
  };
};

export default EditMonitoredKeywordPage;
