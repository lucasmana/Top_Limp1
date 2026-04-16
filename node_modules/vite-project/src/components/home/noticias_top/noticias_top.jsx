import React, { useState, useEffect, useRef } from 'react';
import './noticias_top.css';

const NoticiasTop = () => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const noticiasRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = noticiasRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={noticiasRef}
      className={`noticias-top-section ${sectionVisible ? 'section-visible' : ''}`}
    >
      <div className="noticias-top-container">
        <h2 className="noticias-top-title">Notícias Top</h2>

        <div className="noticias-top-grid">

          <div className="noticia-item">
            <img
              src="/img/noticias2.jpg"
              alt="Notícia 1"
              className="noticia-img"
            />
            <p className="noticia1"  onClick={() => window.open('https://www.toplimppe.com.br/post/falta-de-%C3%A1gua-afetar%C3%A1-recife-e-rmr-compesa-anuncia-manuten%C3%A7%C3%A3o-preventiva', '_blank')}>Falta de água afetará Recife e RMR: Compesa anuncia manutenção preventiva</p>
          </div>

          <div className="noticia-item">
            <img
              src="/img/noticias1.jpg"
              alt="Notícia 2"
              className="noticia-img"
            />
            <p className="noticia2" onClick={() => window.open('https://www.toplimppe.com.br/post/grupo-top-realizou-palestra-sobre-seguran%C3%A7a-no-tr%C3%A2nsito-em-apoio-ao-maio-amarelo', '_blank')}>Grupo Top realiza palestra sobre segurança no trânsito em apoio ao Maio Amarelo</p>
          </div>

          <div className="noticia-item">
            <img
              src="/img/noticias3.jpg"
              alt="Notícia 3"
              className="noticia-img"
            />
            <p className="noticia3" onClick={() => window.open('https://www.toplimppe.com.br/post/s%C3%ADndicos-precisam-ficar-atentos-ao-calend%C3%A1rio-de-limpeza-das-caixas-d-%C3%A1gua-no-seu-condom%C3%ADnio', '_blank')}>Síndicos precisam ficar atentos ao calendário de limpeza das caixas d'água no seu condomínio</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default NoticiasTop;