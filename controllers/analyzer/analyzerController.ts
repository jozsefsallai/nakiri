import firstOf from '@/lib/firstOf';
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
    strictGuildCheck,
    strictGroupCheck,
  } = req.body;

  const groupId = firstOf(req.query.group);

  if (!groupId) {
    return res.status(400).json({
      ok: false,
      error: 'ANALYZER_ENDPOINT_CALLED_WITHOUT_GROUP_ID',
    });
  }

  const result = await performAnalysis(
    groupId,
    content,
    {
      analyzeYouTubeVideoIDs,
      analyzeYouTubeChannelIDs,
      analyzeYouTubeChannelHandles,
      analyzeLinks,
      followRedirects,
      preemptiveVideoIDAnalysis,
      greedy,
      guildId,
      strictGuildCheck,
      strictGroupCheck,
    },
    req.gateway,
  );

  return res.json({
    ok: true,
    result,
  });
};
