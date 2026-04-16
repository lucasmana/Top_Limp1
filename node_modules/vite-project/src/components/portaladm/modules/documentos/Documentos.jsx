import React from 'react';
import './Documentos.css';

const Documentos = () => {
  return (
    <div className="portaladm-documentos">
      <h2>Documentos - Gestão Digital</h2>
      
      <div className="documentos-actions">
        <button className="btn-primary">+ Upload Documento</button>
        <button className="btn-secondary">Escanear Documentos</button>
      </div>

      <div className="documentos-filters">
        <select className="filter-select">
          <option value="">Todos os Tipos</option>
          <option value="contrato">Contratos</option>
          <option value="relatorio">Relatórios</option>
        </select>
        <input type="date" className="filter-input" />
      </div>

      <div className="documentos-grid">
        <div className="document-item">
          <div className="document-icon">📄</div>
          <div className="document-info">
            <div className="document-name">Contrato_2024.pdf</div>
            <div className="document-meta">2.3 MB • 15/01/2024</div>
          </div>
          <div className="document-actions">
            <button className="btn-action">👁️</button>
            <button className="btn-action">⬇️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentos;
