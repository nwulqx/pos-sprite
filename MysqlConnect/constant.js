import mysql from 'mysql2';
import { host } from '../constant.js';
// 创建数据库连接池
export const pool = mysql.createPool({
  host,
  user: 'root',
  password: 'poss2023',
  database: 'possChat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
