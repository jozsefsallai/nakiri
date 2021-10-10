import { Analyzer, AnalyzerResult } from '@/core/analyzer';
import { IAnalyzerOptions } from '@/core/analyzer/IAnalyzerOptions';

export const performAnalysis = (
  content: string,
  options: IAnalyzerOptions,
): Promise<AnalyzerResult> => {
  const analyzer = new Analyzer(content, options);
  return analyzer.analyze();
};
