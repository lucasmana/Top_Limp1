import React from 'react';
import './Escalas.css';

const Escalas = () => {
  return (
    <div className="portaladm-escalas">
      <h2>Escalas 6x1 - Controle de Folgas</h2>
      
      <div className="escalas-actions">
        <button className="btn-primary">+ Nova Escala</button>
        <button className="btn-secondary">Gerar Escala Mensal</button>
      </div>

      <div className="escalas-filters">
        <select className="filter-select">
          <option value="">Todos os Colaboradores</option>
          <option value="operacional">Operacional</option>
        </select>
        <input type="month" className="filter-input" defaultValue="2024-03" />
      </div>

      <div className="escalas-table">
        <table>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Função</th>
              <th>Folgas Semanais</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João Silva</td>
              <td>Técnico de Limpeza</td>
              <td>Sábado</td>
              <td>
                <button className="btn-action">📋</button>
                <button className="btn-action">✏️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Escalas;
