import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [events, setEvents] = useState([]);
  const [state, setState] = useState('Carregando eventos...');
  useEffect(() => { fetch('/api/events').then((response) => { if (!response.ok) throw new Error('Não foi possível carregar os eventos'); return response.json(); }).then((data) => { setEvents(data); setState(''); }).catch((error) => setState(error.message)); }, []);
  return <main><header><p className="eyebrow">EVENTS CRUD</p><h1>Agenda de eventos</h1><p className="subtitle">Registros carregados da API NestJS com PostgreSQL.</p></header>{state && <p className="status">{state}</p>}{!state && <div className="table-wrap"><table><thead><tr><th>ID</th><th>Título</th><th>Início</th><th>Fim</th><th>Local</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td>{event.id}</td><td className="title">{event.title}</td><td>{new Date(event.starts_at).toLocaleString('pt-BR')}</td><td>{event.ends_at ? new Date(event.ends_at).toLocaleString('pt-BR') : '-'}</td><td>{event.location || '-'}</td></tr>)}</tbody></table></div>}</main>;
}
createRoot(document.getElementById('root')).render(<App />);
