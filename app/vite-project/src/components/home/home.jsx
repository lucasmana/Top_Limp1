import { useState, useEffect, useRef } from 'react'
import './home.css'
import './servicos/servicos.css'
import Segmentos from './segmentos/segmentos'
import Agua from './agua/agua'
import Corporativo from './corporativo/corporativo'
import Clientes from './clientes/clientes'
import Informacoes from './informacoes/informacoes'
import Bolhas from './bolhas/bolhas'
import NoticiasTop from './noticias_top/noticias_top'
import SolicitacaoLimpeza from './solicitacao_limpeza/solicitacao_limpeza'
import Footer from './footer/footer'

const FOTOS_CARROSSEL = [
  { src: '/img/operacional1.png', alt: 'Operacional 1' },
  { src: '/img/operacional2.png', alt: 'Operacional 2' },
  { src: '/img/operacional3.png', alt: 'Operacional 3' },
  { src: '/img/operacional4.png', alt: 'Operacional 4' },
  { src: '/img/operacional5.png', alt: 'Operacional 5' },
]

function Home() {
  const [slide, setSlide] = useState(0)
  const [sectionVisible, setSectionVisible] = useState(false)
  const servicosRef = useRef(null)
  const segmentosRef = useRef(null)
  const corporativoRef = useRef(null)
  const clientesRef = useRef(null)
  const noticiasRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      setSlide((s) => {
        if (s === FOTOS_CARROSSEL.length - 1) {
          return 0
        }
        return s + 1
      })
    }, 4500)

    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (servicosRef.current) {
      observer.observe(servicosRef.current)
    }

    return () => {
      if (servicosRef.current) {
        observer.unobserve(servicosRef.current)
      }
    }
  }, [])

  return (
    <div className="home">
      {/* Menu Horizontal */}
      <header className="home-header">
        <div className="home-header-content">
          <div className="home-header-left">
            <button 
              className="home-logo-btn"
              onClick={() => window.location.reload()}
              title="Voltar para página inicial"
            >
              <img
                src="/img/logo1.png"
                alt="Top Limp"
                className="home-logo-img"
              />
            </button>
            <nav className="home-nav">
              <button className="home-nav-item" onClick={()=>{window.location.href = 'https://www.toplimppe.com.br/'}}>Início</button>
              <button className="home-nav-item" onClick={() => servicosRef.current?.scrollIntoView({ behavior: 'smooth' })}>Serviços</button>
              <button className="home-nav-item" onClick={() => segmentosRef.current?.scrollIntoView({ behavior: 'smooth' })}>Segmentos</button>
              <button className="home-nav-item" onClick={() => corporativoRef.current?.scrollIntoView({ behavior: 'smooth' })}>Corporativo</button>
              <button className="home-nav-item" onClick={() => clientesRef.current?.scrollIntoView({ behavior: 'smooth' })}>Clientes</button>
              <button className="home-nav-item" onClick={() => noticiasRef.current?.scrollIntoView({ behavior: 'smooth' })}>Notícias Top</button>
              <button className="home-nav-item">Fale Conosco</button>
              <button className="home-nav-item">Portal do Cliente</button>
            </nav>
          </div>
          <div className="home-header-right">
            {/* Espaço futuro */}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="home-main">
        <section className="home-carrossel">
          <div className="home-carrossel-track">
            {FOTOS_CARROSSEL.map((foto, i) => (
              <div
                key={i}
                className={`home-carrossel-slide ${i === slide ? 'home-carrossel-slide--ativo' : ''}`}
                aria-hidden={i !== slide}
              >
                <img src={foto.src} alt={foto.alt} className="home-carrossel-img" />
                <div className="home-carrossel-overlay" />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="home-carrossel-btn home-carrossel-btn--prev"
            onClick={() =>
              setSlide((s) => (s - 1 + FOTOS_CARROSSEL.length) % FOTOS_CARROSSEL.length)
            }
            aria-label="Foto anterior"
          >
            &lt;
          </button>

          <button
            type="button"
            className="home-carrossel-btn home-carrossel-btn--next"
            onClick={() =>
              setSlide((s) => (s + 1) % FOTOS_CARROSSEL.length)
            }
            aria-label="Próxima foto"
          >
            &gt;
          </button>

          <div className="home-carrossel-dots">
            {FOTOS_CARROSSEL.map((_, i) => (
              <span
                key={i}
                className={`home-carrossel-dot ${i === slide ? 'home-carrossel-dot--ativo' : ''}`}
                onClick={() => setSlide(i)}
                role="button"
              />
            ))}
          </div>
        </section>

        {/* NOVA SECTION ADICIONADA */}
        <section ref={servicosRef} className={`home-info ${sectionVisible ? 'section-visible' : ''}`}>
          <div className="home-info-content">
            <h1 className="home-info-title">Serviços da Top</h1>
            
            <div className="home-info-layout">
              {/* Card principal azul */}
              <div className="home-info-main-card">
              <h3>  <span className="destaque-maior">Soluções</span> completas com o melhor{" "}
                    <span className="destaque-maior">custo x benefício</span>
                </h3>
              </div>
              
              {/* Seta */}
              <div className={`home-info-arrow ${sectionVisible ? 'arrow-animate' : ''}`}></div>
              
              {/* Cards de serviços */}
              <div className="home-info-services">
                <div className="home-info-service-card">
                  <div className="home-info-service-img">
                    <img src="/img/Gemini_Generated_Image_wiar31wiar31wiar.png" alt="Limpeza de reservatórios" />
                  </div>
                  <p className={sectionVisible ? 'text-animate' : ''}>Limpeza e desinfecção de reservatórios de água</p>
                </div>
                
                <div className="home-info-service-card">
                  <div className="home-info-service-img">
                    <img src="/img/Gemini_Generated_Image_dqhypcdqhypcdqhy.png" alt="Limpeza de coifas" />
                  </div>
                  <p className={sectionVisible ? 'text-animate' : ''}>Limpeza de coifas de cozinhas</p>
                </div>
                
                <div className="home-info-service-card">
                  <div className="home-info-service-img">
                    <img src="/img/Gemini_Generated_Image_giexn3giexn3giex.png" alt="Limpeza de bebedouros" />
                  </div>
                  <p className={sectionVisible ? 'text-animate' : ''}>Limpeza e desinfecção de bebedouros</p>
                </div>
                
                <div className="home-info-service-card">
                  <div className="home-info-service-img">
                    <img src="/img/Gemini_Generated_Image_5uo8zi5uo8zi5uo8.png" alt="Limpeza de caminhões" />
                  </div>
                  <p className={sectionVisible ? 'text-animate' : ''}>Limpeza de caminhões tanque</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div ref={segmentosRef}><Segmentos /></div>
        <Agua />
        <div ref={corporativoRef}><Corporativo /></div>
        <div ref={clientesRef}><Clientes /></div>
        <Informacoes />
        <Bolhas />
        <div ref={noticiasRef}><NoticiasTop /></div>
       
        <SolicitacaoLimpeza />
        <Footer />

      </main>
    </div>
  )
}

export default Home