import { Analyzer, AnalyzerResult } from '@/core/analyzer';
import { IAnalyzerOptions } from '@/core/analyzer/IAnalyzerOptions';
import { Gateway } from '@/gateway';

export const performAnalysis = (
  groupId: string,
  content: string,
  options: IAnalyzerOptions,
  gateway?: Gateway,
): Promise<AnalyzerResult> => {
  const analyzer = new Analyzer(groupId, content, options, gateway);
  return analyzer.analyze();
};
