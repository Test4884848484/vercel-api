import { kv } from '@vercel/kv';

// Создание пользователя
export async function createUser(userData) {
  const userId = `user:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  
  const user = {
    id: userId,
    email: userData.email,
    password: userData.password,
    plan: userData.plan || 'Free Plan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Сохраняем пользователя по ID
  await kv.set(userId, JSON.stringify(user));
  
  // Сохраняем индекс email -> userId для быстрого поиска
  await kv.set(`email:${userData.email}`, userId);
  
  return user;
}

// Получение пользователя по email
export async function getUserByEmail(email) {
  try {
    const userId = await kv.get(`email:${email}`);
    if (!userId) return null;
    
    const userData = await kv.get(userId);
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Получение пользователя по ID
export async function getUserById(userId) {
  try {
    const userData = await kv.get(userId);
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Обновление пользователя
export async function updateUser(userId, updates) {
  const user = await getUserById(userId);
  if (!user) return null;
  
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await kv.set(userId, JSON.stringify(updatedUser));
  return updatedUser;
}

// Получение списка серверов (демо)
export async function getServers() {
  // В реальном приложении это будет из базы данных
  return [
    {
      id: 1,
      name: '🇺🇸 USA - New York',
      country: 'US',
      host: 'us-ny.flaxvpn.com',
      port: 8080,
      protocol: 'HTTP',
      ping: 45,
      ip: '45.76.123.45',
      status: 'online'
    },
    {
      id: 2,
      name: '🇬🇧 UK - London',
      country: 'GB',
      host: 'uk-ln.flaxvpn.com',
      port: 8080,
      protocol: 'HTTP',
      ping: 25,
      ip: '78.129.234.56',
      status: 'online'
    },
    {
      id: 3,
      name: '🇩🇪 Germany - Frankfurt',
      country: 'DE',
      host: 'de-fr.flaxvpn.com',
      port: 8080,
      protocol: 'HTTP',
      ping: 35,
      ip: '85.214.123.78',
      status: 'online'
    }
  ];
}
