import Box from '@/components/common/box/Box';
import { IGroup } from '@/db/models/groups/Group';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import * as NewGroupValidator from '@/validators/NewGroupValidator';
import { CompactDangerMessageBox } from '@/components/common/messagebox/MessageBox';
import Button from '@/components/common/button/Button';
import apiService from '@/services/apis';
import { UpdateGroupAPIRequest } from '@/services/apis/groups/GroupsAPIService';
import toaster from '@/lib/toaster';
import { useUserGroups } from '@/hooks/useGroups';
import { errors } from '@/lib/errors';

export interface GroupDetailsEditorProps {
  group: IGroup;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  setGroup: Dispatch<SetStateAction<IGroup>>;
}

const GroupDetailsEditor: React.FC<GroupDetailsEditorProps> = ({
  group,
  setEditMode,
  setGroup,
}) => {
  const { reloadGroups } = useUserGroups();

  const handleFormSubmit = async (
    { name, description }: UpdateGroupAPIRequest,
    { setSubmitting }: FormikHelpers<UpdateGroupAPIRequest>,
  ) => {
    try {
      const res = await apiService.groups.updateGroup(group.id, {
        name,
        description,
      });
      toaster.success('Group updated successfully!');

      await reloadGroups();

      setGroup({
        ...group,
        ...res.group,
      });

      setEditMode(false);
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
    <Box title="Edit Group">
      <Formik
        initialValues={{
          name: group.name,
          description: group.description,
        }}
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
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default GroupDetailsEditor;
