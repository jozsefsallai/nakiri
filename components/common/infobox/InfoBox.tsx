import { ReactNode } from 'react';

export interface InfoBoxProps {
  children: ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ children }) => {
  return <div className="py-3 text-gray text-sm">{children}</div>;
};

export default InfoBox;
