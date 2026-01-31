// pages/index.js
export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{
          fontSize: '48px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          FlaxVPN API
        </h1>
        <p style={{ fontSize: '18px', color: '#b0b0b0', marginBottom: '30px' }}>
          Backend API для FlaxVPN расширения
        </p>
        
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'left'
        }}>
          <h2 style={{ marginBottom: '15px' }}>Доступные эндпоинты:</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <code style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '5px 10px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                POST /api/auth/register
              </code>
              <span style={{ marginLeft: '10px', color: '#b0b0b0' }}>- Регистрация</span>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <code style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '5px 10px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                POST /api/auth/login
              </code>
              <span style={{ marginLeft: '10px', color: '#b0b0b0' }}>- Вход</span>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <code style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '5px 10px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                GET /api/auth/verify
              </code>
              <span style={{ marginLeft: '10px', color: '#b0b0b0' }}>- Проверка токена</span>
            </li>
            <li>
              <code style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '5px 10px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                POST /api/logs/connection
              </code>
              <span style={{ marginLeft: '10px', color: '#b0b0b0' }}>- Логирование</span>
            </li>
          </ul>
        </div>

        <p style={{ marginTop: '30px', color: '#666' }}>
          Статус: <span style={{ color: '#2ecc71' }}>✓ Активен</span>
        </p>
      </div>
    </div>
  );
}
