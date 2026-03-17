import React from 'react';
import './Configuracoes.css';

const Configuracoes = () => {
  return (
    <div className="portaladm-configuracoes">
      <h2>Configurações - Sistema TOP LIMP</h2>
      
      <div className="configuracoes-tabs">
        <div className="config-tabs">
          <button className="config-tab active">Geral</button>
          <button className="config-tab">Notificações</button>
          <button className="config-tab">Segurança</button>
        </div>

        <div className="config-content">
          <div className="config-section">
            <h3>Configurações Gerais</h3>
            <div className="config-form">
              <div className="form-group">
                <label>Nome da Empresa</label>
                <input type="text" defaultValue="TOP LIMP Serviços Ambientais" className="config-input" />
              </div>
              <div className="form-group">
                <label>CNPJ</label>
                <input type="text" defaultValue="12.345.678/0001-90" className="config-input" />
              </div>
            </div>
          </div>

          <div className="config-actions">
            <button className="btn-primary">Salvar Configurações</button>
            <button className="btn-secondary">Restaurar Padrão</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
