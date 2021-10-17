import { Analyzer, AnalyzerResult } from '@/core/analyzer';
import { IAnalyzerOptions } from '@/core/analyzer/IAnalyzerOptions';

export const performAnalysis = (
  groupId: string,
  content: string,
  options: IAnalyzerOptions,
): Promise<AnalyzerResult> => {
  const analyzer = new Analyzer(groupId, content, options);
  return analyzer.analyze();
};
