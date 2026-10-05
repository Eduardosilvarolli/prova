import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
function App(){const [events,setEvents]=useState([]); useEffect(()=>{fetch('http://localhost:3000/events').then(r=>r.json()).then(setEvents).catch(()=>setEvents([]))},[]); return <main><h1>Events</h1><p>CRUD de eventos</p><ul>{events.map(e=><li key={e.id}><strong>{e.title}</strong><span>{e.location||'Sem local'} · {new Date(e.starts_at).toLocaleString('pt-BR')}</span></li>)}</ul></main>}
createRoot(document.getElementById('root')).render(<App/>);
