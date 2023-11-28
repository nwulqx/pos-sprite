import HttpsProxyAgent from 'https-proxy-agent';
import OpenAI from 'openai';
import { apiKey } from './constant.js';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import { chatPrompt } from './constant.js';

const openai = new OpenAI({
  apiKey,
});

export const queryOpenAi = (chatMessages) => {
  return openai.chat.completions.create(
    {
      messages: chatMessages,
      model: 'gpt-3.5-turbo-1106',
    },
    {
      proxy: false,
      httpAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
      httpsAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
    }
  );
};

const app = new Koa();
const router = new Router();
const port = 9999;

// 使用 helmet 中间件来设置 CSP 头
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'*'"],
      scriptSrcAttr: ["'unsafe-inline'"],
    },
  })
);

app.use(
  cors({
    origin: '*', // 允许所有来源访问
    methods: 'GET,HEAD,PUT,POST,DELETE', // 允许的 HTTP 方法
    credentials: true, // 允许发送和接收 cookie
    optionsSuccessStatus: 204, // 预检请求成功的状态码
  })
);
app.use(bodyParser({ enableTypes: ['json', 'text', 'form'] }));
const chatHistory = [...chatPrompt];

// 请求响应
router.post('/openai/text', async (ctx) => {
  const request = ctx.request.body;
  chatHistory.push({ role: 'user', content: request?.userInput || '' });
  try {
    const response = await queryOpenAi(chatHistory);
    chatHistory.push({ role: 'assistant', content: response.choices[0].message.content });
    ctx.body = { data: response.choices[0].message };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to generate response' };
    console.error('error', error);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
