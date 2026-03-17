import React from 'react';
import './Colaboradores.css';

const Colaboradores = () => {
  return (
    <div className="portaladm-colaboradores">
      <h2>Gestão de Colaboradores</h2>
      
      <div className="colaboradores-actions">
        <button className="btn-primary">+ Novo Colaborador</button>
        <button className="btn-secondary">Importar Planilha</button>
      </div>

      <div className="colaboradores-stats">
        <div className="stat-box">
          <div className="stat-number">45</div>
          <div className="stat-label">Total Ativos</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">3</div>
          <div className="stat-label">Inaptos</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">8</div>
          <div className="stat-label">Em Férias</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">3</div>
          <div className="stat-label">Pendências</div>
        </div>
      </div>

      <div className="colaboradores-filters">
        <input type="text" placeholder="Buscar colaborador..." className="filter-input" />
        <select className="filter-select">
          <option value="">Todos os Status</option>
          <option value="apto">Apto</option>
          <option value="inapto">Inapto</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
        <select className="filter-select">
          <option value="">Todos os Departamentos</option>
          <option value="operacional">Operacional</option>
          <option value="administrativo">Administrativo</option>
        </select>
      </div>

      <div className="colaboradores-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Função</th>
              <th>Departamento</th>
              <th>Admissão</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João Silva</td>
              <td>Técnico de Limpeza</td>
              <td>Operacional</td>
              <td>15/01/2023</td>
              <td className="status-apto">Apto</td>
              <td>
                <button className="btn-action">👤</button>
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

export default Colaboradores;
