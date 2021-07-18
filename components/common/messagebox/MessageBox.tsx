import clsx from 'clsx';
import { ReactNode } from 'react';

export enum MessageBoxLevel {
  DANGER,
  WARNING,
  SUCCESS,
  INFO
};

export interface MessageBoxProps {
  level: MessageBoxLevel;
  message?: string;
  children?: ReactNode;
};

const MessageBox = ({ level, message, children }: MessageBoxProps) => {
  const classNames = clsx('px-5 py-3 text-white', {
    'bg-danger': level === MessageBoxLevel.DANGER,
    'bg-warning': level === MessageBoxLevel.WARNING,
    'bg-success': level === MessageBoxLevel.SUCCESS,
    'bg-info': level === MessageBoxLevel.INFO
  });

  return (
    <div className={classNames}>
      {children ?? message}
    </div>
  );
};

const Compact = ({ level, message, children }: MessageBoxProps) => {
  const classNames = clsx({
    'text-danger': level === MessageBoxLevel.DANGER,
    'text-warning': level === MessageBoxLevel.WARNING,
    'text-success': level === MessageBoxLevel.SUCCESS,
    'text-info': level === MessageBoxLevel.INFO
  });

  return (
    <div className={classNames}>
      {children ?? message}
    </div>
  );
};

const DangerMessageBox = (props: MessageBoxProps) => <MessageBox {...props} level={MessageBoxLevel.DANGER} />;
const WarningMessageBox = (props: MessageBoxProps) => <MessageBox {...props} level={MessageBoxLevel.WARNING} />;
const SuccessMessageBox = (props: MessageBoxProps) => <MessageBox {...props} level={MessageBoxLevel.SUCCESS} />;
const InfoMessageBox = (props: MessageBoxProps) => <MessageBox {...props} level={MessageBoxLevel.INFO} />;

const CompactDangerMessageBox = (props: MessageBoxProps) => <Compact {...props} level={MessageBoxLevel.DANGER} />;
const CompactWarningMessageBox = (props: MessageBoxProps) => <Compact {...props} level={MessageBoxLevel.WARNING} />;
const CompactSuccessMessageBox = (props: MessageBoxProps) => <Compact {...props} level={MessageBoxLevel.SUCCESS} />;
const CompactInfoMessageBox = (props: MessageBoxProps) => <Compact {...props} level={MessageBoxLevel.INFO} />;

export {
  Compact,

  DangerMessageBox,
  WarningMessageBox,
  SuccessMessageBox,
  InfoMessageBox,

  CompactDangerMessageBox,
  CompactWarningMessageBox,
  CompactSuccessMessageBox,
  CompactInfoMessageBox
};

export default MessageBox;
