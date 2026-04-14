import React, { useState } from 'react';
import './agua.css';

const Agua = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="agua-section">
        <div className="agua-container">
          <div 
            className="agua-img-wrapper"
            onMouseEnter={() => setShowModal(true)}
            onMouseLeave={() => setShowModal(false)}
          >
            <img src="/img/agua_caindo.jpg" alt="Água caindo" className="agua-img" />
          </div>
        </div>
      </section>
      
      {showModal && (
        <div className="agua-modal" onMouseLeave={() => setShowModal(false)}>
          <div className="agua-modal-content">
            <img src="/img/agua_caindo.jpg" alt="Água caindo" className="agua-modal-img" />
            <button 
              className="agua-modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Agua;