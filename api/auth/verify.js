import { verifyToken } from '../../lib/auth.js';
import { getUserById } from '../../lib/db.js';

export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    // Извлекаем токен (удаляем "Bearer " префикс)
    const token = authHeader.substring(7);

    // Проверяем токен
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

    // Получаем пользователя из базы данных
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found' 
      });
    }

    // Возвращаем информацию о валидности токена
    return res.status(200).json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(401).json({ 
      error: 'Token verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
