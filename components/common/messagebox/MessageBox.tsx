import clsx from "clsx";

export enum MessageBoxLevel {
  DANGER,
  WARNING,
  SUCCESS,
  INFO
};

export interface MessageBoxProps {
  level: MessageBoxLevel;
  message: string;
};

const MessageBox = ({ level, message }: MessageBoxProps) => {
  const classNames = clsx('px-5 py-3 text-white', {
    'bg-danger': level === MessageBoxLevel.DANGER,
    'bg-warning': level === MessageBoxLevel.WARNING,
    'bg-success': level === MessageBoxLevel.SUCCESS,
    'bg-info': level === MessageBoxLevel.INFO
  });

  return (
    <div className={classNames}>
      {message}
    </div>
  );
};

export default MessageBox;
