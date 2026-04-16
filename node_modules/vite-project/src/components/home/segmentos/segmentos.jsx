import React from 'react';
import './segmentos.css';

const Segmentos = () => {
  return (
    <section className="segmentos">
      <div className="container">
          <h2 className="segmentos-title">Segmentos</h2>
        <div className="segmentos-grid">
          <div className="segmento-item">
            <div className="segmento-img">
              <img src="/img/condonominal.jpg" alt="Condominial" />
            </div>
            <h3 className="segmento-nome">Condominal</h3>
          </div>
          <div className="segmento-item">
            <div className="segmento-img">
              <img src="/img/Comercial.jpg" alt="Comercial" />
            </div>
            <h3 className="segmento-nome">Comercial</h3>
          </div>
          <div className="segmento-item">
            <div className="segmento-img">
              <img src="/img/industrial.jpg" alt="Industrial" />
            </div>
            <h3 className="segmento-nome">Industrial</h3>
          </div>
          <div className="segmento-item">
            <div className="segmento-img">
              <img src="/img/Hospitalar.jpg" alt="Hospitalar" />
            </div>
            <h3 className="segmento-nome">Hospitalar</h3>
          </div>
          <div className="segmento-item">
            <div className="segmento-img">
              <img src="/img/Educacional.jpg" alt="Educacional" />
            </div>
            <h3 className="segmento-nome">Educacional</h3>
          </div>
          <div className="segmento-item">
            <div className="segmento-img">
              <img src="/img/Hoteleiro.jpg" alt="Hoteleiro" />
            </div>
            <h3 className="segmento-nome">Hoteleiro</h3>
          </div>
        </div>
        <div className="segmentos-cta">
          <button className="segmentos-btn">Solicite o seu orçamento</button>
        </div>
      </div>
    </section>
  );
};

export default Segmentos;