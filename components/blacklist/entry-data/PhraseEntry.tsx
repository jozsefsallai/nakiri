import { Severity } from '@/db/common/Severity';
import { IPhrase } from '@/db/models/blacklists/Phrase';

export interface PhraseEntryProps {
  item: IPhrase;
  onTextClick?: (id: string) => void;
}

const PhraseEntry: React.FC<PhraseEntryProps> = ({ item }) => {
  return (
    <div>
      <div className="font-bold mb-2">{item.content}</div>
      <div className="text-xs">
        <strong>Severity:</strong> {Severity[item.severity]}
      </div>
    </div>
  );
};

export default PhraseEntry;
