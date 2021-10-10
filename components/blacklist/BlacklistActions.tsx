import Button, { ButtonSize } from '@/components/common/button/Button';

export interface BlacklistAction {
  label: string;
  onClick(id: string);
}

export interface BlacklistActionsProps {
  id: string;
  actions: BlacklistAction[];
}

const BlacklistActions = ({ id, actions }: BlacklistActionsProps) => {
  return (
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <Button
          size={ButtonSize.SMALL}
          key={index}
          onClick={() => action.onClick(id)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default BlacklistActions;
