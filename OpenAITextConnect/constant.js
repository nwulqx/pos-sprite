import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// export const apiKey = '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';
// export const apiKey = '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';
export const apiKey = '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';
// 读取训练集文件内容
const trainingFilePath = path.join(__dirname, './TrainingSet');
const systemTrainingData = fs.readFileSync(`${trainingFilePath}/system.txt`, 'utf8');
const assistantTrainingData = fs.readFileSync(`${trainingFilePath}/assistant.txt`, 'utf8');

// 存储对话历史
export const chatPrompt = [
  { role: 'system', content: `${systemTrainingData}` },
  { role: 'assistant', content: `${assistantTrainingData}` },
];
