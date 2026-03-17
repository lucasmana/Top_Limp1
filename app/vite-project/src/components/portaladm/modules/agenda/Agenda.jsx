import React from 'react';
import './Agenda.css';

const Agenda = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  React.useEffect(() => {
    setCurrentDate(new Date());
    setEndDate(new Date(Date.now() + 6*24*60*60*1000));
  }, []);

  return (
    <div className="portaladm-agenda">
      <h2>Agenda Operacional</h2>
      
      <div className="agenda-controls">
        <div className="agenda-nav">
          <button className="btn-nav">◀ Semana Anterior</button>
          <span className="agenda-period">Semana: {currentDate.toLocaleDateString('pt-BR')} - {endDate.toLocaleDateString('pt-BR')}</span>
          <button className="btn-nav">Próxima Semana ▶</button>
        </div>
        <div className="agenda-views">
          <button className="btn-view active">Dia</button>
          <button className="btn-view">Semana</button>
          <button className="btn-view">Mês</button>
        </div>
      </div>

      <div className="agenda-filters">
        <select className="filter-select">
          <option value="">Todos os Clientes</option>
          <option value="hospital">Hospital São Lucas</option>
          <option value="escola">Escola Municipal</option>
        </select>
        <select className="filter-select">
          <option value="">Todas as Equipes</option>
          <option value="alpha">Equipe Alpha</option>
          <option value="beta">Equipe Beta</option>
          <option value="gamma">Equipe Gamma</option>
        </select>
        <input type="date" className="filter-input" />
      </div>

      <div className="agenda-calendar">
        <div className="agenda-days">
          <div className="agenda-day">
            <div className="day-header">
              <span className="day-name">Segunda-feira</span>
              <span className="day-date">25/03/2024</span>
            </div>
            <div className="day-services">
              <div className="service-item">
                <span className="service-time">08:00</span>
                <span className="service-client">Hospital São Lucas</span>
                <span className="service-type">Reservatório</span>
              </div>
              <div className="service-item">
                <span className="service-time">14:00</span>
                <span className="service-client">Escola Municipal</span>
                <span className="service-type">Bebedouros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
