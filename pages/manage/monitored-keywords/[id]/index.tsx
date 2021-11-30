import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import { IKeywordSearchResult } from '@/db/models/keywords/KeywordSearchResult';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';
import YouTubeVideoEntry from '@/components/blacklist/entry-data/YouTubeVideoEntry';

import apiService from '@/services/apis';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface KeywordSearchResultsIndexPageProps {
  id: string;
}

const KeywordSearchResultsIndexPage: React.FC<KeywordSearchResultsIndexPageProps> =
  ({ id }) => {
    const [guilds, _, guildsErrored] = useGuilds();
    const [keyword, setKeyword] = useState<IMonitoredKeyword | null>(null);
    const [items, setItems] = useState<IKeywordSearchResult[] | null>(null);
    const [pagination, setPagination] = useState<APIPaginationData | null>(
      null,
    );
    const [title, setTitle] = useState('Loading...');
    const [error, setError] = useState<string>('');

    const targetGuild = useRef<string | null>(null);

    const updateTargetGuild = (guildId: string) => {
      if (guildId.length === 0) {
        targetGuild.current = null;
        return;
      }

      targetGuild.current = guildId;
    };

    const fetchKeyword = async () => {
      setKeyword(null);
      setError('');

      try {
        const { entry } =
          await apiService.monitoredKeywords.getMonitoredKeyword(id);
        setKeyword(entry);
        setTitle(`Search Results - ${entry.keyword}`);
      } catch (err) {
        const message = err?.response?.data?.error;

        if (message) {
          setError(errors[message]);
          return;
        }

        setError(errors.INTERNAL_SERVER_ERROR);
      }
    };

    const fetchItems = async ({ page }: IFetcherOptions = {}) => {
      setItems(null);
      setPagination(null);
      setError('');

      try {
        const { keywordSearchResults, pagination } =
          await apiService.keywordSearchResults.getKeywordSearchResults({
            id,
            page,
          });
        setItems(keywordSearchResults);
        setPagination(pagination);
      } catch (err) {
        setError('Failed to load search results for this keyword.');
      }
    };

    const addVideoToBlacklist = async (videoID: string, guildId?: string) => {
      try {
        await apiService.videoIDs.addVideoID({ videoID, guild: guildId });
        toaster.success(`Added video with ID ${videoID}.`);
      } catch (err) {
        const message = err?.response?.data?.error;

        if (message) {
          toaster.danger(errors[message]);
          return;
        }

        toaster.danger(errors.INTERNAL_SERVER_ERROR);
      }
    };

    const addChannelToBlacklist = async (channelID: string, guild?: string) => {
      try {
        await apiService.channelIDs.addChannelID({ channelID, guild });
        toaster.success(`Added channel with ID ${channelID}.`);
      } catch (err) {
        const message = err?.response?.data?.error;

        if (message) {
          toaster.danger(errors[message]);
          return;
        }

        toaster.danger(errors.INTERNAL_SERVER_ERROR);
      }
    };

    const handleTextClick = async (text: string) => {
      const url = `https://youtube.com/watch/?v=${text}`;

      const result = await Swal.fire({
        title: 'Confirm action',
        text: `Are you sure you want to open the following URL: ${url}?`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });

      if (result.isConfirmed) {
        window.open(url, '_blank');
      }
    };

    const handleBlacklistVideoActionClick = async (id: string) => {
      targetGuild.current = null;

      const item = items?.find((item) => item.id === id);
      if (!item) {
        return;
      }

      const result = await MySwal.fire({
        title: 'Pick a blacklist',
        html: (
          <div>
            <p>
              Where would you like to blacklist the video{' '}
              <strong>{item.title}</strong>?
            </p>
            <p>
              <select onChange={(e) => updateTargetGuild(e.target.value)}>
                <option value="">Global</option>
                {guilds?.map((guild) => (
                  <option key={guild.id} value={guild.id}>
                    {guild.name}
                  </option>
                ))}
              </select>
            </p>
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: 'Blacklist',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) {
        return;
      }

      await addVideoToBlacklist(item.videoId, targetGuild.current);
    };

    const handleBlacklistChannelActionClick = async (id: string) => {
      targetGuild.current = null;

      const item = items?.find((item) => item.id === id);
      if (!item) {
        return;
      }

      const result = await MySwal.fire({
        title: 'Pick a blacklist',
        html: (
          <div>
            <p>
              Where would you like to blacklist the channel{' '}
              <strong>{item.uploaderName}</strong>?
            </p>
            <p>
              <select onChange={(e) => updateTargetGuild(e.target.value)}>
                <option value="">Global</option>
                {guilds?.map((guild) => (
                  <option key={guild.id} value={guild.id}>
                    {guild.name}
                  </option>
                ))}
              </select>
            </p>
          </div>
        ),
        showCancelButton: true,
        confirmButtonText: 'Blacklist',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) {
        return;
      }

      await addChannelToBlacklist(item.uploader, targetGuild.current);
    };

    useEffect(() => {
      fetchKeyword();
    }, []);

    useEffect(() => {
      if (guildsErrored) {
        setError('Failed to fetch your guilds.');
      }
    }, [guildsErrored]);

    return (
      <DashboardLayout hasContainer title={title}>
        {keyword && (
          <Blacklist
            items={items}
            pagination={pagination}
            fetcher={fetchItems}
            error={error}
            zdsMessage="There are no search results for this keyword!"
            onTextClick={handleTextClick}
            entryComponent={YouTubeVideoEntry}
            actions={
              guilds === null
                ? []
                : [
                    {
                      label: 'Blacklist video',
                      onClick: handleBlacklistVideoActionClick,
                    },
                    {
                      label: 'Blacklist channel',
                      onClick: handleBlacklistChannelActionClick,
                    },
                  ]
            }
          />
        )}

        {keyword === null && !error && <Loading />}
        {keyword === null && error.length > 0 && (
          <MessageBox level={MessageBoxLevel.DANGER} message={error} />
        )}
      </DashboardLayout>
    );
  };

export default KeywordSearchResultsIndexPage;
