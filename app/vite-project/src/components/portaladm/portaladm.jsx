import React, { useState } from 'react';
import './portaladm.css';

// Importar todos os módulos separados
import Dashboard from './modules/dashboard/Dashboard';
import Clientes from './modules/clientes/Clientes';
import Servicos from './modules/servicos/Servicos';
import Agenda from './modules/agenda/Agenda';
import Colaboradores from './modules/colaboradores/Colaboradores';
import RHDP from './modules/rhdp/RHDP';
import SSMA_SST from './modules/ssma_sst/SSMA_SST';
import Escalas from './modules/escalas/Escalas';
import Equipes from './modules/equipes/Equipes';
import Veiculos from './modules/veiculos/Veiculos';
import Documentos from './modules/documentos/Documentos';
import Relatorios from './modules/relatorios/Relatorios';
import Configuracoes from './modules/configuracoes/Configuracoes';

const PortalAdm = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: '' },
    { id: 'clientes', label: 'Clientes', icon: '' },
    { id: 'servicos', label: 'Serviços', icon: '' },
    { id: 'agenda', label: 'Agenda Operacional', icon: '' },
    { id: 'colaboradores', label: 'Colaboradores', icon: '' },
    { id: 'rhdp', label: 'RH/DP', icon: '' },
    { id: 'ssma_sst', label: 'SSMA/SST', icon: '' },
    { id: 'escalas', label: 'Escalas 6x1', icon: '' },
    { id: 'equipes', label: 'Equipes', icon: '' },
    { id: 'veiculos', label: 'Veículos', icon: '' },
    { id: 'documentos', label: 'Documentos', icon: '' },
    { id: 'relatorios', label: 'Relatórios', icon: '' },
    { id: 'configuracoes', label: 'Configurações', icon: '' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch(activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'clientes':
        return <Clientes />;
      case 'servicos':
        return <Servicos />;
      case 'agenda':
        return <Agenda />;
      case 'colaboradores':
        return <Colaboradores />;
      case 'rhdp':
        return <RHDP />;
      case 'ssma_sst':
        return <SSMA_SST />;
      case 'escalas':
        return <Escalas />;
      case 'equipes':
        return <Equipes />;
      case 'veiculos':
        return <Veiculos />;
      case 'documentos':
        return <Documentos />;
      case 'relatorios':
        return <Relatorios />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return (
          <div className="portaladm-default">
            <h2>{menuItems.find(item => item.id === activeModule)?.label}</h2>
            <p>Módulo em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="portaladm-container">
      {/* Header Corporativo */}
      <header className="portaladm-header">
        <div className="portaladm-logo">
          <img 
            src="img/logo1.png" 
            alt="TOPLAB" 
            className="portaladm-logo-img"
          />
          <div>
            <h1>Sistema TOP LIMP</h1>
            <div className="system-subtitle">Gestão Operacional Integrada</div>
          </div>
        </div>
        <div className="portaladm-user">
          <span>Administrador</span>
          <button className="portaladm-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {/* Layout Principal */}
      <div className="portaladm-layout">
        {/* Menu Lateral Corporativo */}
        <aside className="portaladm-sidebar">
          <div className="menu-content">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`menu-item ${activeModule === item.id ? 'active' : ''}`}
                onClick={() => setActiveModule(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="portaladm-main">
          <div className="portaladm-content">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortalAdm;
