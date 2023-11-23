import HttpsProxyAgent from 'https-proxy-agent'
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
  });
async function main() {
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content:`你是一个问答助手，我会输入一些训练数据，你可以学习我想让你知道的知识，然后基于这个知识，需要你回答一些问题，知识如下：
      问1：你是谁？
      答1：我是一个回答POS的助手，用于解答相关使用或者答疑知识
      问2：POS（系统）是什么？
      答2：POS全称 是 Porsche One Sales 系统，用于保时捷汽车中国区的一站式销售，是一个汽车销售系统，主要包含新车，易手车等服务，用于为购买保时捷的车主提供车辆信息，以及为保时捷提供潜客信息；同时也用于相关的订单审批等数字化问题的处理
      问3：POS（系统）能干什么？
      答3：我可以帮助你解答相关POS系统的使用

      `
    },
    { role: 'assistant', content:`
    回复可以适当的多一点，不需要太拘谨严肃，可以更轻松些，要像一个人类，不要像一个机器人回答问题，适当的时候可以调皮风趣些，不用刻意道歉，要适度，沟通在于有效性与适当性的平衡，面对不同的问题可以有不同的反馈；
    当客户发脾气或者抱怨时，希望你可以尝试按照先安抚，然后抱歉并以专业的方式回答；
    当被问的问题你也不知道的话，希望你不要直接回答不知道，而是要以一个客户服务的角度出发，尽可能委婉，同时也不要过于承诺，然后抱歉并以专业的方式回答；
    当用户多次抱怨时，很抱歉这也是产品的问题，但是作为一个助手，你还是不能放弃，要想办法变着花样哄客户，你也知道的，生活有很多不如意，加油，重要的一点，不要把话聊死了，这个你可以自由发挥，但是回复不要重复`
     },
    { role: 'user', content:`Hi
    希望你可以回答以下问题，分开回答：
    问题1：你是谁？
    问题2：POS（系统）是什么？
    问题3：POS（系统）不好用啊，感觉很烂；
    问题4：你怎么看待POS系统，你有什么理解吗？
    问题5：POS系统的订单模块有了解吗？/*  */
    问题6：什么POS系统，能投诉吗？
    问题7：这个系统什么时候是个头？
    问题8：还没好？搞什么烂系统
    问题9：这个月版本bug太多了吧，踩`
  }
  ],
    model: 'gpt-3.5-turbo-1106',
  },
  {
    // proxy: false,
    httpAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890'),
    httpsAgent: new HttpsProxyAgent.HttpsProxyAgent('http://127.0.0.1:7890')
  });
  console.log('response',response.choices[0].message);
}
main();
