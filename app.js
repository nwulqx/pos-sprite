import HttpsProxyAgent from 'https-proxy-agent';
import OpenAI from 'openai';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
  apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
});

// 读取训练集文件内容
const trainingFilePath = path.join(__dirname, './TrainingSet');
const systemTrainingData = fs.readFileSync(`${trainingFilePath}/system.txt`, 'utf8');
const assistantTrainingData = fs.readFileSync(`${trainingFilePath}/assistant.txt`, 'utf8');
let sessionId;

// async function main() {
//   const response = await openai.chat.completions.create(
//     {
//       messages: [
//         { role: 'system', content: `${systemTrainingData}` },
//         { role: 'assistant', content: `${assistantTrainingData}` },
//         {
//           role: 'user',
//           content: `Hi 希望你可以回答以下问题，分开回答：
//             问题1：你是谁？
//             问题2：POS（系统）是什么？
//             问题3：POS（系统）不好用啊，感觉很烂；
//             问题4：你怎么看待POS系统，你有什么理解吗？
//             问题5：POS系统的订单模块有了解吗？/*  */
//             问题6：什么POS系统，能投诉吗？
//             问题7：这个系统什么时候是个头？
//             问题8：还没好？搞什么烂系统
//             问题9：这个月版本bug太多了吧，踩`,
//         },
//       ],
//       model: 'gpt-3.5-turbo-1106',
//     },
//     {
//       proxy: false,
//       httpAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
//       httpsAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
//     }
//   );
//   // console.log('response', response.choices[0].message);
// }

import readline from 'readline';

// 存储对话历史
let chatHistory = [
  { role: 'system', content: `${systemTrainingData}` },
  { role: 'assistant', content: `${assistantTrainingData}` },
];

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
      // 发送请求给 OpenAI 获取回复
      const response = await openai.chat.completions.create(
        {
          messages: chatHistory,
          model: 'gpt-3.5-turbo-1106',
        },
        {
          proxy: false,
          httpAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
          httpsAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
        }
      );

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

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

app.use(bodyParser());

router.post('/generate-response', async (ctx) => {
  const { messages } = ctx.request.body;

  try {
    const response = await openai.chat.completions.create(
      {
        messages: chatHistory,
        model: 'gpt-3.5-turbo-1106',
      },
      {
        proxy: false,
        httpAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
        httpsAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
      }
    );

    ctx.body = { response: response.choices[0].message };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to generate response' };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
