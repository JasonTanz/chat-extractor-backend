import { isEmpty, reduce, size } from 'lodash';
import logger from '../config/logger';
import { Request, Response } from 'express';
import { UserRanking, UserWordCount } from '../@types/common';

export const analyze = (req: Request, res: Response): Response => {
  // retrieve files from the request object
  const files = req.body.files;
  // initialize response array
  const response = [];

  try {
    // iterate through each file
    for (const file of files) {
      // read file buffer as string
      const data = file.buffer.toString('utf-8');
      // analyze the file
      const result = analyzeChattiestUser(data, file?.originalname);
      // push the result to the response array
      response.push(result);
    }
    logger.info('Analysis completed');
    return res.status(200).json({
      message: 'Analysis completed',
      data: response,
    });
  } catch (error) {
    logger.error('Error in analyzing the file', error);
    return res.status(500).json({
      message: 'Error in analyzing the file',
      error,
    });
  }
};

export const analyzeChattiestUser = (
  data: string,
  fileName: string,
): UserRanking => {
  const lines = data.split('\n');
  const userWordCount: UserWordCount = {};
  let prevUser;

  for (const line of lines) {
    // Locate the start of <
    const startIdx = line.indexOf('<');
    // Locate the end of >
    const endIdx = line.indexOf('>');
    // Split the line by space
    const formattedLine = line.trim().split(' ');
    // Check if start with < and end with >
    if (startIdx !== -1 && endIdx !== -1) {
      // Extract username
      const user = line.substring(startIdx + 1, endIdx);

      // Retrieve the number of words and minus the username
      const words = size(formattedLine) - 1;

      // Assign to the obj
      userWordCount[user] = (userWordCount[user] || 0) + words;

      // Record previous user for the next line
      prevUser = user;
    } else if (prevUser && !isEmpty(line)) {
      // Add the number of words to the previous user
      userWordCount[prevUser] += size(formattedLine);
    }
  }

  // Sort users by word count in descending order
  const sortedUsers = Object.keys(userWordCount).sort(
    (a, b) => userWordCount[b] - userWordCount[a],
  );

  let prevValue: number;
  let rank = 1;

  // Group user by ranking
  const result = reduce(
    sortedUsers,
    (acc: any, next) => {
      if (prevValue === userWordCount[next]) {
        acc[rank - 1].push({ name: next, wordCount: userWordCount[next] });
      } else {
        acc[rank] = [{ name: next, wordCount: userWordCount[next] }];
        rank++;
      }
      prevValue = userWordCount[next];
      return acc;
    },
    {} as { name: string; wordCount: number }[],
  );
  return { [fileName]: result };
};

export default {
  analyze,
};
