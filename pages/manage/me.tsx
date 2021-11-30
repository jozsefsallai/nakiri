import Button from '@/components/common/button/Button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import DashboardLayout from '@/layouts/DashboardLayout';
import toaster from '@/lib/toaster';
import { User } from '@/lib/User';
import apiService from '@/services/apis';
import { UpdateUserAPIRequest } from '@/services/apis/users/UsersAPIService';
import { useEffect, useState } from 'react';

const UpdateUserPage = () => {
  const [currentUser, setCurrentUser] = useCurrentUser();
  const [requestInProgress, setRequestInProgress] = useState(false);

  // Display preferences
  const [hideThumbnails, setHideThumbnails] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setHideThumbnails(currentUser.hideThumbnails);
    }
  }, [currentUser]);

  const handleSubmit = async (settings: UpdateUserAPIRequest) => {
    setRequestInProgress(true);

    try {
      const { user } = await apiService.users.updateUser(settings);
      setCurrentUser(new User(user));
      toaster.success('Settings updated');
    } catch (error) {
      toaster.danger('Internal server error.');
    }

    setRequestInProgress(false);
  };

  const handleDisplayPreferencesSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    await handleSubmit({
      hideThumbnails,
    });
  };

  return (
    <DashboardLayout hasContainer title="My Settings">
      <h4>Display Preferences</h4>
      <form onSubmit={handleDisplayPreferencesSubmit}>
        <div className="input-group">
          <input
            type="checkbox"
            id="hideThumbnails"
            name="hideThumbnails"
            checked={hideThumbnails}
            onChange={(e) => setHideThumbnails(e.target.checked)}
          />

          <label htmlFor="hideThumbnails">Hide thumbnails</label>
        </div>

        <div className="input-group">
          <Button type="submit" disabled={requestInProgress}>
            Save
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default UpdateUserPage;
