import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// 数据库连接逻辑
async function connectDb() {
  if (!MONGODB_URI) {
    console.warn('警告: 未检测到 MONGODB_URI 环境变量，系统将降级使用 Mock 模式。');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    console.log('✅ 成功连接到 MongoDB Atlas 云数据库');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    console.log('正在降级使用 Mock 模式进行演示...');
  }
}

// 初始化连接
connectDb();

// 中间件配置
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      'http://localhost:5173', 
      'https://your-admin-domain.vercel.app', 
      'https://servicewechat.com'
    ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 路由挂载
app.use('/api', apiRoutes);

// 后台管理页面路由
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '中医智能问诊后台运行中' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;