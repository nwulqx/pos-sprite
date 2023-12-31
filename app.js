import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import serve from 'koa-static';
import axios from 'axios';
import { host } from './constant.js';

// todo
import { insertConversationData } from './MysqlConnect/index.js';

const app = new Koa();
const router = new Router();
const port = 3005;

app.use(serve('./public'));
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

// 请求响应
router.post('/chat/generate-response', async (ctx) => {
  const request = ctx.request.body;
  const userInput = request?.userInput;
  try {
    const response = await axios.post(`http://${host}:8080/openai/text`, {
      userInput,
    });
    const data = response.data;
    const time = new Date();
    const content = data?.data?.content;
    if (content && userInput) {
      insertConversationData(userInput, content, time);
    }
    ctx.body = data;
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
