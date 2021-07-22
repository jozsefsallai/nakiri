import { NextApiHandler } from 'next';
import { performAnalysis } from './performAnalysis';

export const analyze: NextApiHandler = async (req, res) => {
  const {
    content,
    analyzeYouTubeVideoIDs,
    analyzeYouTubeChannelIDs,
    analyzeYouTubeChannelHandles,
    analyzeLinks,
    followRedirects,
    preemptiveVideoIDAnalysis,
    greedy,
    guildId,
    strictGuildCheck
  } = req.body;

  const result = await performAnalysis(content, {
    analyzeYouTubeVideoIDs,
    analyzeYouTubeChannelIDs,
    analyzeYouTubeChannelHandles,
    analyzeLinks,
    followRedirects,
    preemptiveVideoIDAnalysis,
    greedy,
    guildId,
    strictGuildCheck
  });

  return res.json({
    ok: true,
    result
  });
};
