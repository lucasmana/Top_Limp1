import React, { useState, useEffect, useRef } from 'react';
import './solicitacao_limpeza.css';

const SolicitacaoLimpeza = () => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const solicitacaoRef = useRef(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoServico: '',
    mensagem: ''
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (solicitacaoRef.current) {
      observer.observe(solicitacaoRef.current);
    }

    return () => {
      if (solicitacaoRef.current) {
        observer.unobserve(solicitacaoRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    // Aqui você pode adicionar a lógica de envio do formulário
    alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      tipoServico: '',
      mensagem: ''
    });
  };

  return (
    <section ref={solicitacaoRef} className={`solicitacao-section ${sectionVisible ? 'section-visible' : ''}`}>
      
        
        

        <div className="solicitacao-content">
          <h2 className="solicitacao-title">Solicite <br />Sua <br /> limpeza </h2>
          <form className="solicitacao-form-horizontal" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome" className="label-nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="input-nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="label-email">Email</label>
                <input
                  type="tel"
                  id="email"
                  name="email"
                  className="input-email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone" className="label-telefone">Telefone</label>
                <input
                  type="email"
                  id="telefone"
                  name="telefone"
                  className="input-telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipo" className="label-tipo">Tipo de Limpeza</label>
                <select
                  id="tipo"
                  name="tipo"
                  className="input-tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="reservatorio">Limpeza de caixa d'agua</option>
                  <option value="coifa">Limpeza de Cisterna</option>
                  <option value="bebedouro">Limpeza de torres alpinas</option>
                  <option value="caminhao">Limpeza de tanques industriais</option>
                  <option value="coifa_cozinha">Limpeza de coifas de cozinha</option>
                  <option value="coifa_cozinha">Limpeza de coifas de cozinha</option>+
                  <option value="bebedouro">Limpeza de bebedouros</option>
                  <option value="caminhao">Limpeza de carros pipa</option>
                  <option value="fachada">Limpeza de fachada</option>



                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mensagem" className="label-mensagem">Informações Adicionais</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  className="input-mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows="2"
                  
                ></textarea>
              </div>

              <button type="submit" className="solicitacao-btn-simple">
                Enviar
              </button>
            </div>
          </form>
        </div>
      
    </section>
  );
};

export default SolicitacaoLimpeza;