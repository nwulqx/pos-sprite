import { pool } from './constant.js';

// 将对话数据插入数据库的函数
export async function insertConversationData(question, answer, time) {
  const connection = await pool.promise().getConnection();

  try {
    // 执行插入语句
    const [rows, fields] = await connection.execute(
      'INSERT INTO conversation_data ( question, answer, time) VALUES (?, ?, ?)',
      [question, answer, time]
    );
    console.log('Inserted conversation data:', rows);
  } catch (error) {
    console.error('Error inserting conversation data:', error);
  } finally {
    // 释放连接
    connection.release();
  }
}

// mysql test
// const role = 'user';
// const question = 'Say hi to me';
// const answer = 'Hi, 有什么可以帮助到您的吗？'; // 你的回答
// const time = new Date(); // 获取当前时间

// insertConversationData(role, question, answer, time);
