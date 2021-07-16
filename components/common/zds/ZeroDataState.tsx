import { Frown } from 'react-feather';

export interface ZeroDataStateProps {
  message?: string;
};

const ZeroDataState = ({ message }: ZeroDataStateProps) => {
  return (
    <div className="flex items-center gap-3 text-gray py-5">
      <Frown className="w-12 h-12" />
      <div>{message ?? 'No data available.'}</div>
    </div>
  );
};

export default ZeroDataState;
