import db from '@/services/db';

import {
  IMonitoredKeyword,
  MonitoredKeyword,
} from '@/db/models/keywords/MonitoredKeyword';

export const getMonitoredKeyword = async (
  id: string,
): Promise<IMonitoredKeyword | null> => {
  await db.prepare();
  const monitoredKeywordsRepository = db.getRepository(MonitoredKeyword);

  const entry = await monitoredKeywordsRepository.findOne({ id });
  return entry || null;
};

export const getMonitoredKeywords = async (
  guildId: string,
): Promise<IMonitoredKeyword[]> => {
  await db.prepare();
  const monitoredKeywordsRepository = db.getRepository(MonitoredKeyword);

  const entries = await monitoredKeywordsRepository.find({ guildId });
  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
