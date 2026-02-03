// api/auth/oauth/[provider].js
import { createUser, getUserByEmail } from '../../../lib/db.js';
import { generateToken } from '../../../lib/auth.js';

export default async function handler(req, res) {
  const { provider } = req.query;

  // Поддерживаемые провайдеры
  const supportedProviders = ['google', 'github', 'discord'];
  
  if (!supportedProviders.includes(provider)) {
    return res.status(400).json({ error: 'Unsupported OAuth provider' });
  }

  // OAuth конфигурация для разных провайдеров
  const oauthConfig = {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scopes: ['openid', 'email', 'profile']
    },
    github: {
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scopes: ['user:email']
    },
    discord: {
      authUrl: 'https://discord.com/api/oauth2/authorize',
      tokenUrl: 'https://discord.com/api/oauth2/token',
      userInfoUrl: 'https://discord.com/api/users/@me',
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scopes: ['identify', 'email']
    }
  };

  const config = oauthConfig[provider];

  // Если нет кода, редиректим на OAuth страницу
  if (!req.query.code) {
    const redirectUri = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/oauth/${provider}`;
    const scopes = config.scopes.join(' ');
    
    const authUrl = `${config.authUrl}?` +
      `client_id=${config.clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}`;

    return res.redirect(authUrl);
  }

  // Обмениваем код на токен
  try {
    const code = req.query.code;
    const redirectUri = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/oauth/${provider}`;

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    // Получаем информацию о пользователе
    const userResponse = await fetch(config.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const userData = await userResponse.json();

    // Извлекаем email в зависимости от провайдера
    let email;
    switch (provider) {
      case 'google':
        email = userData.email;
        break;
      case 'github':
        email = userData.email || `${userData.login}@github.user`;
        break;
      case 'discord':
        email = userData.email;
        break;
    }

    if (!email) {
      return res.status(400).json({ error: 'Email not provided by OAuth provider' });
    }

    // Проверяем, существует ли пользователь
    let user = await getUserByEmail(email);

    // Если нет - создаем нового
    if (!user) {
      user = await createUser({
        email: email.toLowerCase(),
        password: '', // Пароль не нужен для OAuth пользователей
        plan: 'Free Plan',
        oauthProvider: provider,
        oauthId: userData.id || userData.sub
      });
    }

    // Генерируем JWT токен
    const token = generateToken(user.id);

    // Формируем URL для редиректа обратно в расширение
    const extensionRedirectUrl = `https://${process.env.EXTENSION_ID}.chromiumapp.org/?` +
      `token=${token}&` +
      `user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        email: user.email,
        plan: user.plan
      }))}`;

    return res.redirect(extensionRedirectUrl);

  } catch (error) {
    console.error('OAuth error:', error);
    return res.status(500).json({ 
      error: 'OAuth authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
