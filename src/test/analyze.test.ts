const fs = require('fs');
const { analyzeChattiestUser } = require('../controllers/chat.controller');
const path = require('path');

const readFileData = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, `./data/${filePath}`),
    'utf-8',
  );
};

describe('analyzeChattiestUser', () => {
  const testData1 = readFileData('test-data-1.txt');
  const testData2 = readFileData('test-data-2.txt');
  const testData3 = readFileData('test-data-3.txt');
  const testData4 = readFileData('test-data-4.txt');
  const testData5 = readFileData('test-data-5.txt');
  const testData6 = readFileData('test-data-6.txt');

  it('should correctly analyze and rank the chattiest users', () => {
    const expectedOutput = {
      'test-data-1.txt': {
        1: [{ name: 'user2', wordCount: 23 }],
        2: [
          { name: 'user1', wordCount: 18 },
          { name: 'user3', wordCount: 18 },
        ],
      },
    };

    const result = analyzeChattiestUser(testData1, 'test-data-1.txt');
    expect(result).toEqual(expectedOutput);
  });

  it('should handle multiple lines from the same user', () => {
    const expectedOutput = {
      'test-data-2.txt': {
        1: [{ name: 'user1', wordCount: 14 }],
        2: [{ name: 'user2', wordCount: 9 }],
      },
    };

    const result = analyzeChattiestUser(testData2, 'test-data-2.txt');
    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty lines and special characters', () => {
    const expectedOutput = {
      'test-data-3.txt': {
        1: [{ name: 'user1', wordCount: 9 }],
        2: [{ name: 'user2', wordCount: 5 }],
      },
    };

    const result = analyzeChattiestUser(testData3, 'test-data-3.txt');
    expect(result).toEqual(expectedOutput);
  });

  it('should handle lines with only username', () => {
    const expectedOutput = {
      'test-data-4.txt': {
        1: [
          { name: 'user1', wordCount: 0 },
          { name: 'user2', wordCount: 0 },
        ],
      },
    };

    const result = analyzeChattiestUser(testData4, 'test-data-4.txt');
    expect(result).toEqual(expectedOutput);
  });

  it('should handle lines with only username and empty lines', () => {
    const expectedOutput = {
      'test-data-5.txt': {
        1: [
          { name: 'user1', wordCount: 0 },
          { name: 'user2', wordCount: 0 },
        ],
      },
    };

    const result = analyzeChattiestUser(testData5, 'test-data-5.txt');
    expect(result).toEqual(expectedOutput);
  });

  it('should output the ranking correctly if there"s multiple user with same words count', () => {
    const expectedOutput = {
      'text-data-6.txt': {
        1: [{ name: 'jason', wordCount: 29 }],
        2: [{ name: 'user3', wordCount: 13 }],
        3: [
          { name: 'user2', wordCount: 8 },
          { name: 'user4', wordCount: 8 },
          { name: 'user5', wordCount: 8 },
        ],
        4: [{ name: 'user6', wordCount: 3 }],
        5: [
          { name: 'user7', wordCount: 2 },
          { name: 'user8', wordCount: 2 },
        ],
      },
    };

    const result = analyzeChattiestUser(testData6, 'text-data-6.txt');
    expect(result).toEqual(expectedOutput);
  });
});
