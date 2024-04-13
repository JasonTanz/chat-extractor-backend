export type UserWordCount = {
  [key: string]: number;
};

export type UserRanking = {
  [key: string]: { name: string; wordCount: number }[];
};
