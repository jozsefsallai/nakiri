import { Severity } from '@/db/common/Severity';

export interface SeverityFieldProps {
  name?: string;
  onChange?: (newSeverity: Severity) => void;
}

const SeverityField: React.FC<SeverityFieldProps> = ({ name, onChange }) => {
  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof onChange === 'undefined') {
      return;
    }

    const rawSeverity = e.target.value;

    if (!(rawSeverity in Severity)) {
      return;
    }

    const severity = parseInt(rawSeverity, 10);
    onChange(severity);
  };

  return (
    <select
      name={name || 'severity'}
      id={name || 'severity'}
      onChange={handleSeverityChange}
      defaultValue={Severity.MEDIUM}
    >
      <option value={Severity.VERY_LOW}>Very low</option>
      <option value={Severity.LOW}>Low</option>
      <option value={Severity.MEDIUM}>Medium</option>
      <option value={Severity.HIGH}>High</option>
      <option value={Severity.VERY_HIGH}>Very high</option>
    </select>
  );
};

export default SeverityField;
