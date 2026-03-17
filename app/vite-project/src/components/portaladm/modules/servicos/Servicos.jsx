import React from 'react';
import './Servicos.css';

const Servicos = () => {
  return (
    <div className="portaladm-servicos">
      <h2>Gestão de Serviços</h2>
      
      <div className="servicos-stats">
        <div className="stat-box">
          <div className="stat-number">127</div>
          <div className="stat-label">Executados</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">45</div>
          <div className="stat-label">Agendados</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">12</div>
          <div className="stat-label">A Vencer</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">5</div>
          <div className="stat-label">Vencidos</div>
        </div>
      </div>

      <div className="servicos-filters">
        <select className="filter-select">
          <option value="">Todos os Tipos</option>
          <option value="reservatorio">Reservatório</option>
          <option value="bebedouro">Bebedouro</option>
          <option value="coifa">Coifa</option>
          <option value="outros">Outros</option>
        </select>
        <select className="filter-select">
          <option value="">Todos os Status</option>
          <option value="executado">Executado</option>
          <option value="agendado">Agendado</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <input type="date" className="filter-input" />
        <input type="date" className="filter-input" />
      </div>

      <div className="servicos-table">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Data Execução</th>
              <th>Próxima</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SRV-001</td>
              <td>Hospital São Lucas</td>
              <td>Reservatório</td>
              <td>10/02/2024</td>
              <td>10/05/2024</td>
              <td className="status-executado">Executado</td>
              <td>
                <button className="btn-action">📋</button>
                <button className="btn-action">📄</button>
                <button className="btn-action">📧</button>
              </td>
            </tr>
            <tr>
              <td>SRV-002</td>
              <td>Escola Municipal</td>
              <td>Bebedouros</td>
              <td>15/01/2024</td>
              <td>15/04/2024</td>
              <td className="status-agendado">Agendado</td>
              <td>
                <button className="btn-action">📋</button>
                <button className="btn-action">📄</button>
                <button className="btn-action">📧</button>
              </td>
            </tr>
            <tr>
              <td>SRV-003</td>
              <td>Restaurante Central</td>
              <td>Coifas</td>
              <td>20/12/2023</td>
              <td>20/03/2024</td>
              <td className="status-pendente">Pendente</td>
              <td>
                <button className="btn-action">📋</button>
                <button className="btn-action">📄</button>
                <button className="btn-action">📧</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Servicos;
