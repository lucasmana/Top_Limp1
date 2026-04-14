import React, { useState, useEffect, useRef } from 'react';
import './informacoes.css';

const Informacoes = () => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const informacoesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (informacoesRef.current) {
      observer.observe(informacoesRef.current);
    }

    return () => {
      if (informacoesRef.current) {
        observer.unobserve(informacoesRef.current);
      }
    };
  }, []);

  return (
    <section ref={informacoesRef} className={`informacoes-section ${sectionVisible ? 'section-visible' : ''}`}>
      {/* Parte Azul Superior */}
      <div className="informacoes-parte informacoes-parte-azul-superior">
        <div className="informacoes-container">
          
          <p className="informacoes-texto">
            "A Top Limp transformou a qualidade da água em nosso condomínio. Profissionais dedicados e serviço impecável.
            Recomendo a todos!"
          </p>
        </div>
      </div>

      {/* Parte Branca Central */}
      <div className="informacoes-parte informacoes-parte-branca">
        <div className="informacoes-container">
          
          <p className="informacoes-texto informacoes-texto-escuro">
            
"A Top Limp garantiu a segurança e a saúde dos nossos colaboradores com uma limpeza eficiente e profissional. Excelente serviço!"
          </p>
        </div>
      </div>

      {/* Parte Azul Inferior */}
      <div className="informacoes-parte informacoes-parte-azul-inferior">
        <div className="informacoes-container">
          
          <p className="informacoes-texto">
      
"A Top Limp é nossa parceira de confiança. A limpeza das caixas d'água é sempre realizada com precisão e qualidade. Estamos muito satisfeitos!"
          </p>
        </div>
      </div>
    </section>
  );
};

export default Informacoes;