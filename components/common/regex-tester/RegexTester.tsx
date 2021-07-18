import { isValidRegex } from '@/lib/commonValidators';
import { FormEvent, useEffect, useState } from 'react';
import {
  CompactDangerMessageBox,
  CompactInfoMessageBox,
  CompactSuccessMessageBox
} from '@/components/common/messagebox/MessageBox';

export interface RegexTesterProps {
  pattern: string;
};

const RegexTester = ({ pattern }: RegexTesterProps) => {
  const [ isValid, setIsValid ] = useState(isValidRegex(pattern));
  const [ hasMatch, setHasMatch ] = useState(false);
  const [ regex, setRegex ] = useState<RegExp | null>(null);

  useEffect(() => {
    if (isValid) {
      setRegex(new RegExp(pattern, 'gm'));
    }
  }, [ isValid ]);

  const handleTextboxChange = (e: FormEvent<HTMLTextAreaElement>) => {
    if (!regex) {
      return;
    }

    setHasMatch(regex.test(e.currentTarget.value));
  };

  return (
    <div>
      <div className="text-sm">
        Pattern:<br /><pre>{pattern}</pre>
      </div>

      <textarea onChange={handleTextboxChange}></textarea>
      {hasMatch && <CompactSuccessMessageBox message="At least one match has been found!" />}
      {!hasMatch && <CompactInfoMessageBox message="No matches found." />}
      {!isValid && <CompactDangerMessageBox message="Invalid regular expression." />}
    </div>
  );
};

export default RegexTester;
