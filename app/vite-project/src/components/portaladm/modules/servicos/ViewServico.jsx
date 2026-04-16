import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Servicos.css'; // Cache-busting: forçar atualização - recarregue a página (Ctrl+F5)

const ViewServico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarServico = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/Servicos/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setServico(data.servico);
        } else {
          console.error('Erro ao buscar serviço:', data.message);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarServico();
  }, [id]);

  const handleVoltar = () => {
    navigate('/portaladm/servicos');
  };

  if (loading) {
    return (
      <div className="portaladm-servicos">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando serviço...</p>
        </div>
      </div>
    );
  }

  if (!servico) {
    return (
      <div className="portaladm-servicos">
        <div className="error-container">
          <h3>Serviço não encontrado</h3>
          <button className="btn-primary" onClick={handleVoltar}>
            Voltar para Serviços
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portaladm-servicos">
      <div className="servicos-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-secondary" onClick={handleVoltar}>
            ← Voltar
          </button>
          <h2>Visualização do Serviço</h2>
        </div>
      </div>

      <div className="view-servico-page">
        <div className="servico-info-card">
          <div className="info-header">
            <h4>Dados do Serviço</h4>
            <div className="servico-codigo">SRV-{String(servico._id).slice(-6).toUpperCase()}</div>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Cliente</label>
              <div className="info-value">{servico.cliente || 'N/A'}</div>
            </div>
            
            <div className="info-item">
              <label>Tipo de Serviço</label>
              <div className="info-value">{servico.tipoServico || 'N/A'}</div>
            </div>
            
            <div className="info-item">
              <label>Status</label>
              <div className={`info-value status-${servico.status?.toLowerCase().replace(' ', '-')}`}>
                {servico.status?.toUpperCase() || 'N/A'}
              </div>
            </div>
            
            <div className="info-item">
              <label>Nº Orçamento</label>
              <div className="info-value">{servico.numeroOrcamento || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="servico-info-card">
          <div className="info-header">
            <h4>Informações Comerciais</h4>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Valor do Serviço</label>
              <div className="info-value highlight">R$ {servico.valor || '0,00'}</div>
            </div>
            
            <div className="info-item">
              <label>Periodicidade</label>
              <div className="info-value">{servico.periodicidade || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="servico-info-card">
          <div className="info-header">
            <h4>Descrição do Serviço</h4>
          </div>
          
          <div className="description-box">
            <p>{servico.descricao || 'Nenhuma descrição informada'}</p>
          </div>
        </div>

        <div className="servico-info-card">
          <div className="info-header">
            <h4>Execução do Serviço</h4>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Equipe Responsável</label>
              <div className="info-value">{servico.equipeMembros || 'N/A'}</div>
            </div>
            
            <div className="info-item">
              <label>Veículo</label>
              <div className="info-value">{servico.veiculoPlaca || 'N/A'}</div>
            </div>
            
            <div className="info-item">
              <label>datasExecucao</label>
              <div className="info-value">
                {servico.datasExecucao && servico.datasExecucao.length > 0 
                  ? servico.datasExecucao.map((data, index) => (
                      <div key={index} className="execution-item">
                        <span className="date-tag">
                          {new Date(data.data).toLocaleDateString('pt-BR')}
                        </span>
                        {data.status && (
                          <span className={`status-tag status-${data.status.toLowerCase().replace(' ', '-')}`}>
                            {data.status}
                          </span>
                        )}
                        {data.observacao && (
                          <div className="observacao-text">
                            {data.observacao}
                          </div>
                        )}
                      </div>
                    ))
                  : 'Nenhuma data registrada'
                }
              </div>
            </div>
            
            <div className="info-item">
              <label>Estruturas Realizadas</label>
              <div className="info-value">{servico.estruturasRealizadas || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="servico-info-card">
          <div className="info-header">
            <h4>Assinatura e Observações</h4>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Acompanhante</label>
              <div className="info-value">{servico.acompanhanteAssinatura || 'N/A'}</div>
            </div>
          </div>
          
          <div className="description-box">
            <p>{servico.observacoes || 'Nenhuma observação informada'}</p>
          </div>
        </div>

        <div className="servico-info-card">
          <div className="info-header">
            <h4>Informações de Sistema</h4>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <label>ID do Serviço</label>
              <div className="info-value">{servico._id}</div>
            </div>
            
            <div className="info-item">
              <label>Data de Cadastro</label>
              <div className="info-value">{servico.createdAt ? new Date(servico.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</div>
            </div>
            
            <div className="info-item">
              <label>Última Atualização</label>
              <div className="info-value">{servico.updatedAt ? new Date(servico.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="view-actions">
          <button className="btn-secondary" onClick={handleVoltar}>
            Voltar para Lista de Serviços
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewServico;
