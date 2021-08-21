import { ProcessingState } from '@/db/common/ProcessingState';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';

import { Clock } from 'react-feather';

import clsx from 'clsx';
import truncate from 'lodash.truncate';
import { format as formatDate } from 'date-fns';

export interface YouTubeVideoEntryProps {
  item: IYouTubeVideoID;
  onTextClick?(text: string): void;
};

const YouTubeVideoEntry: React.FC<YouTubeVideoEntryProps> = ({ item, onTextClick }) => {
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
        {item.thumbnailUrl && <img src={item.thumbnailUrl} alt={item.title} className="w-full rounded-md" />}
        {!item.thumbnailUrl && (
          <div className="h-24 bg-ayame-primary text-white rounded-md flex items-center justify-center text-2xl">
            <Clock />
          </div>
        )}
      </div>

      <div className="flex-1">
        {(item.status === ProcessingState.PENDING || item.status === ProcessingState.QUEUED) && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>{item.videoId}</h3>
            <small>{item.status === ProcessingState.PENDING ? 'Processing metadata...' : 'Queued to be processed by a worker.'}</small>
          </>
        )}

        {item.status === ProcessingState.FAILED && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>{item.videoId}</h3>
            <small className="text-danger">Failed to process metadata.</small>
          </>
        )}

        {item.status === ProcessingState.DONE && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>{truncate(item.title, { length: 100 })}</h3>
            {item.description && <small>{truncate(item.description, { length: 200 })}</small>}

            <div className="mt-2 text-xs">
              <div>
                <strong>Uploaded by:</strong> <a
                  href={buildChannelURL(item.uploaderId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.uploaderId}
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
