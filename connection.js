// api/logs/connection.js - Vercel Serverless Function

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Хранилище логов (в продакшене используйте БД)
const connectionLogs = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Проверяем авторизацию
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

    // Получаем данные лога
    const logData = req.body;

    // Добавляем информацию о пользователе
    const log = {
      userId: decoded.userId,
      email: decoded.email,
      ...logData,
      recordedAt: new Date().toISOString()
    };

    // Сохраняем лог
    connectionLogs.push(log);

    // В продакшене здесь можно отправлять в БД или аналитику
    // НО НИКОГДА НЕ СОХРАНЯЕМ:
    // - Пароли
    // - Данные банковских карт
    // - Историю браузера
    // - Личные сообщения
    // - Cookies с персональными данными

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
