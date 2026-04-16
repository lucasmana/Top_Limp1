import React, { useEffect, useState } from 'react';
import PortalAdm from './portaladm';

const PortalRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está autenticado como administrativo
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail');
      const userType = localStorage.getItem('userType');

      // Verificar se é o usuário administrativo específico
      if (userEmail === 'sup.operacional@toplimppe.com.br' && userType === 'administrativo') {
        setIsAuthenticated(true);
      } else {
        // Se não for administrativo, redirecionar para login
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);

  // Se não estiver autenticado, mostrar loading ou redirecionar
  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '1.5rem', color: '#1466C8', marginBottom: '1rem' }}>
          Verificando autenticação...
        </div>
        <div style={{ fontSize: '1rem', color: '#64748b' }}>
          Redirecionando para o login...
        </div>
      </div>
    );
  }

  // Se estiver autenticado, mostrar o portal administrativo
  return <PortalAdm />;
};

export default PortalRouter;
