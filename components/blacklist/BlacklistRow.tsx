import clsx from 'clsx';
import BlacklistActions, { BlacklistAction } from './BlacklistActions';

export interface BlacklistRowProps {
  id: string;
  text: string;
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
};

const BlacklistRow = ({ id, text, onTextClick, actions }: BlacklistRowProps) => {
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

  return (
    <div className="blacklist-item flex items-center justify-between px-4 py-3">
      <div>
        <span className={textClassNames} onClick={handleTextClick}>{text}</span>
      </div>

      {actions && actions.length > 0 && <BlacklistActions id={id} actions={actions} />}
    </div>
  );
};

export default BlacklistRow;
