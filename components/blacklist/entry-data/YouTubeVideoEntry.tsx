import { ProcessingState } from '@/db/common/ProcessingState';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import { IKeywordSearchResult } from '@/db/models/keywords/KeywordSearchResult';

import { Clock, Video } from 'react-feather';

import clsx from 'clsx';
import truncate from 'lodash.truncate';
import { format as formatDate } from 'date-fns';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export interface YouTubeVideoEntryProps {
  item: IYouTubeVideoID | IKeywordSearchResult;
  onTextClick?(text: string): void;
};

const YouTubeVideoEntry: React.FC<YouTubeVideoEntryProps> = ({ item, onTextClick }) => {
  const [ currentUser ] = useCurrentUser();

  const handleItemClick = onTextClick
    ? () => onTextClick(item.videoId)
    : undefined;

  const titleClassNames = clsx(
    'my-0 text-lg',
    {
      'cursor-pointer': !!onTextClick,
      'hover:text-ayame-primary': !!onTextClick
    }
  );

  const buildChannelURL = (channelId: string) => {
    return `https://www.youtube.com/channel/${channelId}`;
  };

  return (
    <div className="flex justify-center gap-3">
      <div className="w-36 cursor-pointer" onClick={handleItemClick}>
        {item.thumbnailUrl && !currentUser.hideThumbnails && <img src={item.thumbnailUrl} alt={item.title} className="w-full rounded-md" />}
        {item.thumbnailUrl && currentUser.hideThumbnails && (
          <div
            className="h-24 bg-ayame-primary text-nakiri-base-invert rounded-md flex items-center justify-center text-2xl"
            title="Thumbnail is hidden because you opted out of seeing thumbnails."
          >
            <Video />
          </div>
        )}
        {!item.thumbnailUrl && (
          <div className="h-24 bg-ayame-primary text-nakiri-base-invert rounded-md flex items-center justify-center text-2xl">
            <Clock />
          </div>
        )}
      </div>

      <div className="flex-1">
        {('status' in item && (item.status === ProcessingState.PENDING || item.status === ProcessingState.QUEUED)) && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>{item.videoId}</h3>
            <small>{item.status === ProcessingState.PENDING ? 'Processing metadata...' : 'Queued for processing.'}</small>
          </>
        )}

        {'status' in item && item.status === ProcessingState.FAILED && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>{item.videoId}</h3>
            <small className="text-danger">Failed to process metadata.</small>
          </>
        )}

        {(!('status' in item) || item.status === ProcessingState.DONE) && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>{truncate(item.title, { length: 100 })}</h3>
            {'description' in item && item.description && <small>{truncate(item.description, { length: 200 })}</small>}

            <div className="mt-2 text-xs">
              <div>
                <strong>Uploaded by:</strong> <a
                  href={buildChannelURL('uploaderId' in item ? item.uploaderId : (item as IKeywordSearchResult).uploader)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={'uploaderId' in item ? item.uploaderId : (item as IKeywordSearchResult).uploader}
                >{item.uploaderName}</a>
              </div>

              <div>
                <strong>Uploaded at:</strong> {formatDate(new Date(item.uploadDate), 'MMMM d yyyy, h:mm:ss a')}
              </div>

              <div>
                <strong>Video ID:</strong> {item.videoId}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YouTubeVideoEntry;
