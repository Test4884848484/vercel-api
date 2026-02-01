// pages/api/logs/connection.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'flaxvpn-secret-change-in-production-2026';

const connectionLogs = [];

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const token = authHeader.substring(7);
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Невалидный токен' });
    }

    const logData = req.body;

    const log = {
      userId: decoded.userId,
      email: decoded.email,
      ...logData,
      recordedAt: new Date().toISOString()
    };

    connectionLogs.push(log);

    // Ограничиваем размер логов
    if (connectionLogs.length > 1000) {
      connectionLogs.shift();
    }

    console.log('Connection log saved:', {
      userId: log.userId,
      action: log.action,
      server: log.server?.country
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Log error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
