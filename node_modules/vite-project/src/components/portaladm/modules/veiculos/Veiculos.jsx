import React from 'react';
import './Veiculos.css';

const Veiculos = () => {
  return (
    <div className="portaladm-veiculos">
      <h2>Veículos - Frota Operacional</h2>
      
      <div className="veiculos-actions">
        <button className="btn-primary">+ Novo Veículo</button>
        <button className="btn-secondary">Manutenção Programada</button>
      </div>

      <div className="veiculos-filters">
        <select className="filter-select">
          <option value="">Todos os Status</option>
          <option value="disponivel">Disponível</option>
          <option value="em-uso">Em Uso</option>
        </select>
        <input type="text" placeholder="Placa..." className="filter-input" />
      </div>

      <div className="veiculos-grid">
        <div className="veiculo-card">
          <div className="veiculo-header">
            <h3>VAN-1234</h3>
            <span className="veiculo-status status-ativo">Disponível</span>
          </div>
          <div className="veiculo-info">
            <div className="veiculo-detalhe">
              <strong>Modelo:</strong> Fiat Ducato
            </div>
            <div className="veiculo-detalhe">
              <strong>Ano:</strong> 2022
            </div>
          </div>
          <div className="veiculo-actions">
            <button className="btn-action">🔧</button>
            <button className="btn-action">📍</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Veiculos;
