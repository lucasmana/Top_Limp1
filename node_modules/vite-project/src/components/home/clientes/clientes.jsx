import React, { useState, useEffect, useRef } from 'react';
import './clientes.css';

const Clientes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(null);
  const clientesRef = useRef(null);

  const LOGOS_CLIENTES = [
    { src: '/img/clientes/Arno.jpg', alt: 'Arno' },
    { src: '/img/clientes/Atlanta .jpg', alt: 'Atlanta' },
    { src: '/img/clientes/Ceasa.jpg', alt: 'Ceasa' },
    { src: '/img/clientes/Esperanca.jpg', alt: 'Esperança' },
    { src: '/img/clientes/Fonte.jpg', alt: 'Fonte' },
    { src: '/img/clientes/Logo-Masterboi.png', alt: 'Masterboi' },
    { src: '/img/clientes/Mar_hotel.jpg', alt: 'Mar Hotel' },
    { src: '/img/clientes/MuroAlto.jpg', alt: 'Muro Alto' },
    { src: '/img/clientes/Petobras.jpg', alt: 'Petobras' },
    { src: '/img/clientes/Raymundo_da_fonte.jpg', alt: 'Raymundo da Fonte' },
    { src: '/img/clientes/Shineray.jpg', alt: 'Shineray' },
    { src: '/img/clientes/Shopee.jpg', alt: 'Shopee' },
    { src: '/img/clientes/Stellantis.jpg', alt: 'Stellantis' },
    { src: '/img/clientes/Summerville.jpg', alt: 'Summerville' },
    { src: '/img/clientes/iquine.jpg', alt: 'iquine' },
  ];

  const moveLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + LOGOS_CLIENTES.length) % LOGOS_CLIENTES.length);
  };

  const moveRight = () => {
    setCurrentIndex((prev) => (prev + 1) % LOGOS_CLIENTES.length);
  };

  const goToLogo = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (clientesRef.current) {
      observer.observe(clientesRef.current);
    }

    return () => {
      if (clientesRef.current) {
        observer.unobserve(clientesRef.current);
      }
    };
  }, []);

  const getVisibleLogos = () => {
    const logos = [];
    const totalLogos = LOGOS_CLIENTES.length;
    
    for (let i = 0; i < totalLogos; i++) {
      logos.push(LOGOS_CLIENTES[(currentIndex + i) % LOGOS_CLIENTES.length]);
    }
    
    return logos;
  };

  return (
    <section ref={clientesRef} className={`clientes-section ${sectionVisible ? 'section-visible' : ''}`}>
      <div className="clientes-container">
        <h2 className="clientes-title">Nossos Clientes</h2>
        
        
          <button 
            className="clientes-seta clientes-seta-esquerda"
            onClick={moveLeft}
            aria-label="Ver clientes anteriores"
          >
            &lt;
          </button>

          <div className="clientes-logos-fila">
            {getVisibleLogos().map((logo, index) => (
              <div
                key={index}
                className="cliente-logo-circular"
                onClick={() => {
                  goToLogo((currentIndex + index) % LOGOS_CLIENTES.length);
                  setImagemAberta(logo);
                }}
              >
                <img src={logo.src} alt={logo.alt} className="cliente-logo-img" />
              </div>
            ))}
          </div>

          <button 
            className="clientes-seta clientes-seta-direita"
            onClick={moveRight}
            aria-label="Ver próximos clientes"
          >
            &gt;
          </button>
        
      </div>

      {imagemAberta && (
        <div className="clientes-overlay" onClick={() => setImagemAberta(null)}>
          <img
            src={imagemAberta.src}
            alt={imagemAberta.alt}
            className="clientes-img-ampliada"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </section>
  );
};

export default Clientes;