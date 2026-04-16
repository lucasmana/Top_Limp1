import { useState, useEffect, useMemo } from 'react';
import './SSMA_SST.css';

const API_BASE = 'http://localhost:3001/api';

const SSMA_SST = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedColaborador, setExpandedColaborador] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColaborador, setSelectedColaborador] = useState(null);
  const [documentoForm, setDocumentoForm] = useState({
    tipo: '',
    nome: '',
    dataRealizacao: '',
    dataVencimento: '',
    emitidoPor: '',
    arquivo: null,
    observacoes: ''
  });
  const [documentos, setDocumentos] = useState({});
  const [loadingDocumentos, setLoadingDocumentos] = useState({});

  // Buscar colaboradores do banco de dados
  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/colaboradores`);
        const data = await response.json();
        if (data.success && data.items) {
          setColaboradores(data.items);
          // Buscar contagem de documentos para cada colaborador
          data.items.forEach(async (colaborador) => {
            await fetchDocumentos(colaborador._id);
          });
        }
      } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, []);

  // Filtrar colaboradores por nome
  const filteredColaboradores = useMemo(() => {
    if (!search) return colaboradores;
    const searchTerm = search.toLowerCase();
    return colaboradores.filter(col => 
      col.nome?.toLowerCase().includes(searchTerm)
    );
  }, [colaboradores, search]);

  // Calcular estatísticas (placeholder - será implementado com lógica real de documentos)
  const stats = useMemo(() => {
    return {
      aptos: colaboradores.filter(c => c.status === 'ativo').length,
      comAlertas: colaboradores.filter(c => c.status === 'afastado').length,
      inaptos: colaboradores.filter(c => c.status === 'inativo').length
    };
  }, [colaboradores]);

  const handleToggleExpand = async (colaboradorId) => {
    if (expandedColaborador === colaboradorId) {
      setExpandedColaborador(null);
    } else {
      setExpandedColaborador(colaboradorId);
      await fetchDocumentos(colaboradorId);
    }
  };

  const fetchDocumentos = async (colaboradorId) => {
    try {
      setLoadingDocumentos(prev => ({ ...prev, [colaboradorId]: true }));
      const response = await fetch(`${API_BASE}/documentos_ssma/colaborador/${colaboradorId}`);
      const data = await response.json();
      
      if (data.success) {
        setDocumentos(prev => ({ ...prev, [colaboradorId]: data.documentos }));
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setLoadingDocumentos(prev => ({ ...prev, [colaboradorId]: false }));
    }
  };

  const calcularDiasAteVencimento = (dataVencimento) => {
    try {
      // Converter data do formato dd/mm/aaaa para objeto Date
      const [dia, mes, ano] = dataVencimento.split('/');
      const dataVenc = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      
      // Zerar as horas para comparação precisa
      dataVenc.setHours(0, 0, 0, 0);
      hoje.setHours(0, 0, 0, 0);
      
      const diffTime = dataVenc - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error('Erro ao calcular dias até vencimento:', error);
      return null;
    }
  };

  const baixarArquivo = async (arquivo, arquivoNome) => {
    try {
      const response = await fetch(`${API_BASE}/documentos_ssma/arquivo/${arquivo}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome || arquivo;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      alert('Erro ao baixar arquivo');
    }
  };

  const handleEditarDocumento = (documento) => {
    // Será implementado depois - abrir modal de edição
    console.log('Editar documento:', documento);
    alert('Funcionalidade de edição será implementada em breve');
  };

  const handleArquivarDocumento = (documento) => {
    // Será implementado depois - arquivar documento
    console.log('Arquivar documento:', documento);
    alert('Funcionalidade de arquivamento será implementada em breve');
  };

  const handleExcluirDocumento = async (documento) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        const response = await fetch(`${API_BASE}/documentos_ssma/${documento._id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          // Recarregar documentos do colaborador
          await fetchDocumentos(documento.colaboradorId);
        } else {
          alert('Erro ao excluir documento: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao excluir documento:', error);
        alert('Erro ao excluir documento');
      }
    }
  };

  const handleAddDocument = (colaborador) => {
    setSelectedColaborador(colaborador);
    setDocumentoForm({
      tipo: '',
      nome: '',
      dataRealizacao: '',
      dataVencimento: '',
      emitidoPor: '',
      arquivo: null,
      observacoes: ''
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedColaborador(null);
  };

  const handleDocumentoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let arquivoBase64 = null;
      let arquivoNome = null;
      let arquivoTipo = null;

      // Converter arquivo para base64 se existir
      if (documentoForm.arquivo) {
        arquivoNome = documentoForm.arquivo.name;
        arquivoTipo = documentoForm.arquivo.type;
        
        arquivoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(documentoForm.arquivo);
        });
      }

      const payload = {
        colaboradorId: selectedColaborador._id,
        colaboradorNome: selectedColaborador.nome,
        tipo: documentoForm.tipo,
        nome: documentoForm.nome,
        dataRealizacao: documentoForm.dataRealizacao,
        dataVencimento: documentoForm.dataVencimento,
        emitidoPor: documentoForm.emitidoPor,
        arquivoBase64,
        arquivoNome,
        arquivoTipo,
        observacoes: documentoForm.observacoes
      };

      const response = await fetch(`${API_BASE}/documentos_ssma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        console.log('Documento salvo com sucesso:', data.documento);
        handleCloseModal();
        // Recarregar documentos do colaborador se estiver expandido
        if (expandedColaborador === selectedColaborador._id) {
          fetchDocumentos(selectedColaborador._id);
        }
      } else {
        console.error('Erro ao salvar documento:', data.message);
        alert('Erro ao salvar documento: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      alert('Erro ao salvar documento');
    }
  };

  if (loading) {
    return <div className="ssma-sst-loading">Carregando...</div>;
  }

  return (
    <div className="ssma-sst-container">
      <header className="ssma-sst-header">
        <h2 className="ssma-sst-title">SSMA/SST</h2>
        <p className="ssma-sst-subtitle">Controle de documentação e aptidão dos colaboradores</p>
      </header>

      {/* Quadros de Status */}
      <div className="ssma-sst-stats">
        <div className="ssma-sst-stat-card ssma-sst-stat-aptos">
          <div className="ssma-sst-stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ssma-sst-stat-content">
            <div className="ssma-sst-stat-number">{stats.aptos}</div>
            <div className="ssma-sst-stat-label">Aptos</div>
          </div>
        </div>
        <div className="ssma-sst-stat-card ssma-sst-stat-alertas">
          <div className="ssma-sst-stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2"/>
              <path d="M12 6V12L15 15" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ssma-sst-stat-content">
            <div className="ssma-sst-stat-number">{stats.comAlertas}</div>
            <div className="ssma-sst-stat-label">Com alertas</div>
          </div>
        </div>
        <div className="ssma-sst-stat-card ssma-sst-stat-inaptos">
          <div className="ssma-sst-stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ssma-sst-stat-content">
            <div className="ssma-sst-stat-number">{stats.inaptos}</div>
            <div className="ssma-sst-stat-label">Inaptos</div>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="ssma-sst-search">
        <svg className="ssma-sst-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15.5 15.5M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className="ssma-sst-search-input"
          placeholder="Buscar colaborador"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista de Colaboradores */}
      <div className="ssma-sst-list">
        {filteredColaboradores.map((colaborador) => {
          const initial = String(colaborador.nome || ' ').trim().slice(0, 1).toUpperCase() || '?';
          const isExpanded = expandedColaborador === colaborador._id;
          
          return (
            <div key={colaborador._id} className="ssma-sst-colaborador-item">
              <div 
                className="ssma-sst-colaborador-main"
                onClick={() => handleToggleExpand(colaborador._id)}
              >
                <div className="ssma-sst-colaborador-info">
                  <div className="ssma-sst-avatar">{initial}</div>
                  <div className="ssma-sst-colaborador-details">
                    <div className="ssma-sst-colaborador-name">{colaborador.nome || '—'}</div>
                    <p className="ssma-sst-colaborador-role">{colaborador.funcao || '—'}</p>
                    <div className="ssma-sst-colaborador-docs">
                      <span className="ssma-sst-docs-count">{documentos[colaborador._id]?.length || 0}</span>
                      <span className="ssma-sst-docs-label">documentos</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="ssma-sst-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddDocument(colaborador);
                  }}
                >
                  + Adicionar
                </button>
              </div>
              
              {/* Detalhes expandidos */}
              {isExpanded && (
                <div className="ssma-sst-colaborador-expanded">
                  <div className="ssma-sst-expanded-content">
                    {loadingDocumentos[colaborador._id] ? (
                      <p className="ssma-sst-expanded-placeholder">Carregando documentos...</p>
                    ) : documentos[colaborador._id] && documentos[colaborador._id].length > 0 ? (
                      <div className="ssma-sst-documentos-list">
                        {documentos[colaborador._id].map((doc) => {
                          const diasAteVencimento = doc.dataVencimento ? calcularDiasAteVencimento(doc.dataVencimento) : null;
                          
                          return (
                            <div key={doc._id} className="ssma-sst-documento-item">
                              <div className="ssma-sst-documento-info">
                                <div className="ssma-sst-documento-tipo">{doc.tipo}</div>
                                {doc.dataVencimento && (
                                  <div className="ssma-sst-documento-vencimento">
                                    Vencimento: {doc.dataVencimento}
                                  </div>
                                )}
                                {diasAteVencimento !== null && (
                                  <div className="ssma-sst-documento-dias">
                                    Vence em ({diasAteVencimento} dias)
                                  </div>
                                )}
                              </div>
                              <div className="ssma-sst-documento-actions">
                                {/* Botões de visualizar e baixar sempre visíveis primeiro */}
                                <button
                                  className="ssma-sst-action-btn"
                                  onClick={() => {
                                    if (doc.arquivo) {
                                      window.open(`${API_BASE}/documentos_ssma/arquivo/${doc.arquivo}`, '_blank');
                                    } else {
                                      alert('Nenhum arquivo associado a este documento');
                                    }
                                  }}
                                  title="Visualizar"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  className="ssma-sst-action-btn"
                                  onClick={() => {
                                    if (doc.arquivo) {
                                      baixarArquivo(doc.arquivo, doc.arquivoNome);
                                    } else {
                                      alert('Nenhum arquivo associado a este documento');
                                    }
                                  }}
                                  title="Baixar"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                
                                {/* Botões de edição e gerenciamento */}
                                <button
                                  className="ssma-sst-action-btn"
                                  onClick={() => handleEditarDocumento(doc)}
                                  title="Editar"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  className="ssma-sst-action-btn"
                                  onClick={() => handleArquivarDocumento(doc)}
                                  title="Arquivar"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button
                                  className="ssma-sst-action-btn ssma-sst-action-btn-delete"
                                  onClick={() => handleExcluirDocumento(doc)}
                                  title="Excluir"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="ssma-sst-expanded-placeholder">
                        Nenhum documento cadastrado para este colaborador.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredColaboradores.length === 0 && (
          <div className="ssma-sst-empty">
            Nenhum colaborador encontrado
          </div>
        )}
      </div>

      {/* Modal Novo Documento SSMA */}
      {modalOpen && (
        <div className="ssma-sst-modal-overlay" onClick={handleCloseModal}>
          <div className="ssma-sst-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ssma-sst-modal-header">
              <h3 className="ssma-sst-modal-title">Novo Documento SSMA</h3>
              <button className="ssma-sst-modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="ssma-sst-modal-body">
              <div className="ssma-sst-colaborador-nome">
                {selectedColaborador?.nome?.toUpperCase() || '—'}
              </div>
              <form onSubmit={handleDocumentoSubmit}>
                <div className="ssma-sst-form-group">
                  <label className="ssma-sst-label">Tipo de Documento *</label>
                  <select
                    className="ssma-sst-select"
                    value={documentoForm.tipo}
                    onChange={(e) => setDocumentoForm({ ...documentoForm, tipo: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="ASO">ASO</option>
                    <option value="PCMSO">PCMSO</option>
                    <option value="PGR">PGR</option>
                    <option value="APR">APR</option>
                    <option value="Ficha de EPI(NR 06)">Ficha de EPI(NR 06)</option>
                    <option value="NR 06">NR 06</option>
                    <option value="NR 10">NR 10</option>
                    <option value="NR 12">NR 12</option>
                    <option value="NR 18">NR 18</option>
                    <option value="NR 20">NR 20</option>
                    <option value="NR 33">NR 33</option>
                    <option value="NR 35">NR 35</option>
                    <option value="Ordem de Serviço">Ordem de Serviço</option>
                    <option value="Ficha de Registro">Ficha de Registro</option>
                    <option value="Contrato de Trabalho">Contrato de Trabalho</option>
                    <option value="Carta de Validação de Treinamento">Carta de Validação de Treinamento</option>
                    <option value="Certificado / Treinamento">Certificado / Treinamento</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="ssma-sst-form-group">
                  <label className="ssma-sst-label">Nome / Descrição</label>
                  <input
                    type="text"
                    className="ssma-sst-input"
                    placeholder="Ex: ASO Jan/2025"
                    value={documentoForm.nome}
                    onChange={(e) => setDocumentoForm({ ...documentoForm, nome: e.target.value })}
                  />
                </div>

                <div className="ssma-sst-form-row">
                  <div className="ssma-sst-form-group">
                    <label className="ssma-sst-label">Data de Realização</label>
                    <input
                      type="text"
                      className="ssma-sst-input"
                      placeholder="dd/mm/aaaa"
                      value={documentoForm.dataRealizacao}
                      onChange={(e) => setDocumentoForm({ ...documentoForm, dataRealizacao: e.target.value })}
                    />
                  </div>
                  <div className="ssma-sst-form-group">
                    <label className="ssma-sst-label">Data de Vencimento</label>
                    <input
                      type="text"
                      className="ssma-sst-input"
                      placeholder="dd/mm/aaaa"
                      value={documentoForm.dataVencimento}
                      onChange={(e) => setDocumentoForm({ ...documentoForm, dataVencimento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="ssma-sst-form-group">
                  <label className="ssma-sst-label">Emitido por</label>
                  <input
                    type="text"
                    className="ssma-sst-input"
                    placeholder="Digite o nome do funcionário"
                    value={documentoForm.emitidoPor}
                    onChange={(e) => setDocumentoForm({ ...documentoForm, emitidoPor: e.target.value })}
                  />
                </div>

                <div className="ssma-sst-form-group">
                  <label className="ssma-sst-label">Arquivo (PDF / Imagem)</label>
                  <div className="ssma-sst-file-upload">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocumentoForm({ ...documentoForm, arquivo: e.target.files[0] })}
                    />
                    <div className="ssma-sst-file-info">
                      <p className="ssma-sst-file-placeholder">Arraste o arquivo ou clique para selecionar</p>
                      <p className="ssma-sst-file-types">PDF, JPG, PNG</p>
                    </div>
                  </div>
                </div>

                <div className="ssma-sst-form-group">
                  <label className="ssma-sst-label">Observações</label>
                  <textarea
                    className="ssma-sst-textarea"
                    value={documentoForm.observacoes}
                    onChange={(e) => setDocumentoForm({ ...documentoForm, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="ssma-sst-modal-footer">
                  <button type="button" className="ssma-sst-btn ssma-sst-btn-cancel" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="ssma-sst-btn ssma-sst-btn-submit">
                    Adicionar Documento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSMA_SST;
