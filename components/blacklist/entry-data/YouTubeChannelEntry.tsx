import { ProcessingState } from '@/db/common/ProcessingState';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';

import { Clock } from 'react-feather';

import clsx from 'clsx';
import truncate from 'lodash.truncate';
import { format as formatDate } from 'date-fns';

import { Severity } from '@/db/common/Severity';

export interface YouTubeChannelEntryProps {
  item: IYouTubeChannelID;
  onTextClick?(text: string): void;
}

const YouTubeChannelEntry: React.FC<YouTubeChannelEntryProps> = ({
  item,
  onTextClick,
}) => {
  const handleItemClick = onTextClick
    ? () => onTextClick(item.channelId)
    : undefined;

  const titleClassNames = clsx('my-0 text-lg', {
    'cursor-pointer': !!onTextClick,
    'hover:text-ayame-primary': !!onTextClick,
  });

  return (
    <div className="flex justify-center gap-3">
      <div className="w-20 cursor-pointer" onClick={handleItemClick}>
        {item.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full rounded-md"
          />
        )}
        {!item.thumbnailUrl && (
          <div className="h-20 bg-ayame-primary text-nakiri-base-invert rounded-md flex items-center justify-center text-2xl">
            <Clock />
          </div>
        )}
      </div>

      <div className="flex-1">
        {(item.status === ProcessingState.PENDING ||
          item.status === ProcessingState.QUEUED) && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>
              {item.channelId}
            </h3>
            <small>
              {item.status === ProcessingState.PENDING
                ? 'Processing metadata...'
                : 'Queued to be processed by a worker.'}
            </small>
          </>
        )}

        {item.status === ProcessingState.FAILED && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>
              {item.channelId}
            </h3>
            <small className="text-danger">Failed to process metadata.</small>
          </>
        )}

        {item.status === ProcessingState.DONE && (
          <>
            <h3 className={titleClassNames} onClick={handleItemClick}>
              {truncate(item.name, { length: 100 })}
            </h3>
            {item.description && (
              <small>{truncate(item.description, { length: 200 })}</small>
            )}

            <div className="mt-2 text-xs">
              <div>
                <strong>Created at:</strong>{' '}
                {formatDate(
                  new Date(item.publishedAt),
                  'MMMM d yyyy, h:mm:ss a',
                )}
              </div>

              <div>
                <strong>Channel ID:</strong> {item.channelId}
              </div>
            </div>
          </>
        )}

        <small>
          <strong>Severity:</strong> {Severity[item.severity]}
        </small>
      </div>
    </div>
  );
};

export default YouTubeChannelEntry;
