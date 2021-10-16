export type IBlacklistAddParams<T extends string> = {
  [key in T]: string;
} & {
  groupId?: string;
  guildId?: string;
};