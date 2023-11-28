import readline from 'readline';
import { queryOpenAi } from './OpenAITextConnect/index.js';
import { chatPrompt } from './OpenAITextConnect/constant.js';

const chatHistory = [...chatPrompt];

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// 递归函数，用于不断地获取用户输入和 OpenAI 的回复
function chat() {
  rl.question('你: ', async (userInput) => {
    // 将用户输入添加到对话历史
    chatHistory.push({ role: 'user', content: userInput });
    try {
      const response = await queryOpenAi(chatHistory);
      // 将 OpenAI 的回复添加到对话历史
      chatHistory.push({ role: 'assistant', content: response.choices[0].message.content });

      // 打印回复
      console.log(`助手: ${response.choices[0].message.content}`);

      // 递归调用 chat 函数，继续等待用户输入
      chat();
    } catch (error) {
      console.error('获取回复出错:', error);
      rl.close();
    }
  });
}
chat();
