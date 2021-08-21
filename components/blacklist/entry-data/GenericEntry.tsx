import clsx from 'clsx';

export interface GenericEntryProps {
  text: string;
  onTextClick?(text: string): void;
};

const GenericEntry: React.FC<GenericEntryProps> = ({ text, onTextClick }) => {
  const handleTextClick = onTextClick
    ? () => onTextClick(text)
    : undefined;

  const textClassNames = clsx(
    'font-bold',
    {
      'cursor-pointer': !!onTextClick,
      'hover:text-ayame-primary': !!onTextClick
    }
  );

  return <span className={textClassNames} onClick={handleTextClick}>{text}</span>;
};

export default GenericEntry;
