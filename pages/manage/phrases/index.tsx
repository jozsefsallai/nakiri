import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IPhrase } from '@/db/models/blacklists/Phrase';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserGroups } from '@/hooks/useGroups';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';
import PhraseEntry from '@/components/blacklist/entry-data/PhraseEntry';

const ManagePhrasesIndexPage = () => {
  const { groups, errored } = useUserGroups();
  const [items, setItems] = useState<IPhrase[] | null>(null);
  const [pagination, setPagination] = useState<APIPaginationData | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ group, guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { phrases } = await apiService.phrases.getPhrases({
        group,
        guild,
        page,
      });
      setItems(phrases);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load phrases.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.phrases.deletePhrase(id);
      setItems((items) => items.filter((phrase) => phrase.id !== id));
      toaster.success('Phrase deleted successfully!');
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/phrases/new');
  };

  const handleDeleteActionClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this phrase. This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  useEffect(() => {
    if (errored) {
      setError('Failed to fetch your groups.');
    }
  }, [errored]);

  return (
    <DashboardLayout
      hasContainer
      title="Blacklisted Phrases"
      buttonText="Add phrase"
      onButtonClick={handleNewButtonClick}
    >
      {groups && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted phrases have been found."
          groups={groups}
          actions={[{ label: 'Delete', onClick: handleDeleteActionClick }]}
          entryComponent={PhraseEntry}
        />
      )}

      {groups === null && !error && <Loading />}
      {groups === null && error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export default ManagePhrasesIndexPage;
