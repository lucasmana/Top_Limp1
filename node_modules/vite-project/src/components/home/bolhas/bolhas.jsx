import React, { useState, useEffect, useRef } from 'react';
import './bolhas.css';

const Bolhas = () => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const bolhasRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (bolhasRef.current) {
      observer.observe(bolhasRef.current);
    }

    return () => {
      if (bolhasRef.current) {
        observer.unobserve(bolhasRef.current);
      }
    };
  }, []);

  return (
    <section ref={bolhasRef} className={`bolhas-section ${sectionVisible ? 'section-visible' : ''}`}>
      <div className="bolhas-container">
        <video 
          className="bolhas-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/img/watermarked-1e7a86a6-6517-473d-aaf3-1c7d4b13019f.mp4" type="video/mp4" />
        </video>
        
        <div className="bolhas-overlay">
          <div className="bolhas-content">
            <h2 className="bolhas-title">Pureza e Qualidade</h2>
            <p className="bolhas-description">
              Nossos serviços garantem água limpa e segura para sua saúde e bem-estar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bolhas;
