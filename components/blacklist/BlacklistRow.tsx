import clsx from 'clsx';
import { createElement } from 'react';
import BlacklistActions, { BlacklistAction } from './BlacklistActions';
import GenericEntry from './entry-data/GenericEntry';

export interface BlacklistRowProps {
  id: string;
  text: string;
  item: any;
  entryComponent?: React.FC<any> | React.ComponentClass<any>;
  onTextClick?(text: string): void;
  actions?: BlacklistAction[];
}

const BlacklistRow = ({
  id,
  text,
  item,
  onTextClick,
  actions,
  entryComponent,
}: BlacklistRowProps) => {
  const handleTextClick = onTextClick ? () => onTextClick(text) : undefined;

  const textClassNames = clsx('font-bold', {
    'cursor-pointer': !!onTextClick,
    'hover:text-ayame-primary': !!onTextClick,
  });

  return (
    <div className="blacklist-item flex gap-4 items-center justify-between px-4 py-3">
      <div>
        {entryComponent &&
          createElement(entryComponent, { item, text, onTextClick })}
        {!entryComponent && (
          <GenericEntry text={text} onTextClick={handleTextClick} />
        )}
      </div>

      {actions && actions.length > 0 && (
        <BlacklistActions id={id} actions={actions} />
      )}
    </div>
  );
};

export default BlacklistRow;
