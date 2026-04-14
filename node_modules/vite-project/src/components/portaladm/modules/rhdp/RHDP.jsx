import React from 'react';
import './RHDP.css';

const RHDP = () => {
  return (
    <div className="portaladm-rhdp">
      <h2>RH/DP - Dossiê Digital do Colaborador</h2>
      
      <div className="rhdp-actions">
        <button className="btn-primary">+ Novo Colaborador</button>
        <button className="btn-secondary">Importar Planilha</button>
        <button className="btn-secondary">Exportar Dados</button>
      </div>

      <div className="rhdp-filters">
        <input type="text" placeholder="Buscar colaborador..." className="filter-input" />
        <select className="filter-select">
          <option value="">Todos os Departamentos</option>
          <option value="administrativo">Administrativo</option>
          <option value="operacional">Operacional</option>
        </select>
        <select className="filter-select">
          <option value="">Todos os Status</option>
          <option value="ativo">Ativo</option>
          <option value="ferias">Férias</option>
          <option value="licenca">Licença</option>
        </select>
      </div>

      <div className="rhdp-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Função</th>
              <th>Departamento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João Silva</td>
              <td>123.456.789-00</td>
              <td>Técnico de Limpeza</td>
              <td>Operacional</td>
              <td className="status-ativo">Ativo</td>
              <td>
                <button className="btn-action">👤</button>
                <button className="btn-action">📋</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RHDP;
