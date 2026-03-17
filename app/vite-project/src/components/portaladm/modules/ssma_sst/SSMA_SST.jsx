import React from 'react';
import './SSMA_SST.css';

const SSMA_SST = () => {
  return (
    <div className="portaladm-ssma">
      <h2>SSMA/SST - Sistema Completo de Segurança</h2>
      
      <div className="ssma-actions">
        <button className="btn-primary">+ Novo Documento</button>
        <button className="btn-secondary">Gerar Relatório</button>
        <button className="btn-secondary">Vencimentos</button>
      </div>

      <div className="ssma-filters">
        <select className="filter-select">
          <option value="">Todos os Documentos</option>
          <option value="aso">ASO</option>
          <option value="pcmso">PCMSO</option>
        </select>
        <select className="filter-select">
          <option value="">Todos os Colaboradores</option>
          <option value="ativos">Apenas Ativos</option>
        </select>
      </div>

      <div className="ssma-table">
        <table>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João Silva</td>
              <td>ASO 2024</td>
              <td>Exame Médico</td>
              <td>15/01/2025</td>
              <td className="status-vencido">Vencido</td>
              <td>
                <button className="btn-action">📋</button>
                <button className="btn-action">📄</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SSMA_SST;
