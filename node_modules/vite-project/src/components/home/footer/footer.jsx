 
import React from 'react';
import './footer.css';
 
const Footer = () => {
  return (
    <section className="footer-section">
      <div className="footer-container">
        <div className="footer-content">

          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/img/logo3.png" alt="Top Limp" className="footer-logo-img" />
              <a href="https://www.toplabambiental.com.br/" target="_blank" rel="noopener noreferrer">
                <img src="/img/TOPLAB2.png" alt="TopLab" className="toplab2" />
              </a>
            </div>

            <div className="footer-company-info">
              <p className="footer-company-name">Top Limp Serviços LTDA</p>
              <p className="footer-company-cnpj">CNPJ 15.471.241/0001-96</p>
            </div>

 
          </div>
 
          <div className="footer-address">
            <p className="footer-address-text">
              Rua Caetano Ribeiro, 250 - Casa Caiada Olinda PE |<br /> CEP 53130-440
            </p>
          </div>

          <div className="footer-contact">

            <div className="footer-contact-items">

              <div className="footer-contact-item">
                <span className="footer-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 9.89-5.335 9.89-11.892a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                </span>
                <span className="footer-phone">(81) 98682-4212</span>
              </div>

              <div className="footer-contact-item">
                <span className="footer-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </span>
                <span className="footer-phone">(81) 3014-0038</span>
              </div>
 
              <div className="footer-contact-item">
                <span className="footer-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
                <span className="footer-email">comercial@toplimppe.com.br</span>
              </div>
 
            </div>
          </div>
 
          <div className="footer-policies">
            <ul className="footer-policies-list">
              <li><a href="https://www.toplimppe.com.br/pol%C3%ADtica-de-privacidade" target="_blank" rel="noopener noreferrer" className="footer-policy-link">Política de Privacidade</a></li>
              <li><a href="https://www.toplimppe.com.br/pol%C3%ADtica-de-cookies" target="_blank" rel="noopener noreferrer" className="footer-policy-link">Política de Cookies</a></li>
            </ul>
          </div>
 
        </div>
 
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2025 por Top Limp
          </p>
        </div>
 
      </div>
    </section>
  );
};
 
export default Footer;