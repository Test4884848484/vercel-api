import { getServers } from '../lib/db.js';

export default async function handler(req, res) {
  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const servers = await getServers();
    
    return res.status(200).json(servers);

  } catch (error) {
    console.error('Error fetching servers:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch servers',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
