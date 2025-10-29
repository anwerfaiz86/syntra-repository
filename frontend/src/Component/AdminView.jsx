import React, { useEffect, useState, useRef } from 'react';
import { getDefects, patchDefect, getCounts, API_BASE } from '../api';

export default function AdminView(){
  const [list,setList]=useState([]);
  const [sort,setSort]=useState('newest');
  const [polling,setPolling] = useState(true);
  const countsRef = useRef({});
  const [notify, setNotify] = useState(null);

  const load = async () => {
    try{
      const q = `?sortBy=${sort}`;
      const data = await getDefects(q);
      setList(Array.isArray(data)?data:[]);
    }catch(e){ console.error(e); }
  };

  useEffect(()=>{ load(); }, [sort]);

  useEffect(()=>{
    let timer;
    const poll = async () => {
      try{
        const counts = await getCounts();
        const prevOpen = countsRef.current.Open || 0;
        if (counts.Open > prevOpen && prevOpen !== 0) {
          setNotify(`New defects: Open ${counts.Open}`);
          setTimeout(()=>setNotify(null), 5000);
          load();
        }
        countsRef.current = counts;
      }catch(e){ console.error(e); }
    };
    (async()=>{ countsRef.current = await getCounts().catch(()=>({Open:0})); })();
    if (polling) timer = setInterval(poll, 30000);
    return ()=> clearInterval(timer);
  }, [polling]);

  const updateStatus = async (id, status) => {
    try{ await patchDefect(id, { status }); load(); }catch(e){ console.error(e); }
  };
  const addNotes = async (id) => {
    const note = prompt('Add note');
    if (!note) return;
    try{ await patchDefect(id, { notes: note }); load(); }catch(e){ console.error(e); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Admin — Manage defects</h5>
        <div>
          <label className="me-2">Sort:</label>
          <select className="form-select d-inline-block w-auto me-3" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="status">Status</option>
          </select>
          <div className="form-check form-switch d-inline-block">
            <input className="form-check-input" type="checkbox" checked={polling} onChange={e=>setPolling(e.target.checked)} />
            <label className="form-check-label">Poll for new defects</label>
          </div>
        </div>
      </div>

      {notify && <div className="alert alert-info">{notify}</div>}

      {list.map(d=>(
        <div key={d._id} className="card mb-2">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <strong>{d.title}</strong>
                <div><small className="text-muted">{d.reporter} • {d.category} • {new Date(d.createdAt).toLocaleString()}</small></div>
                <p>{d.description}</p>
                {d.imageUrl && <img src={`${API_BASE}${d.imageUrl}`} alt="" style={{maxWidth:200}} />}
                {d.notes && <div className="mt-1"><strong>Notes:</strong> {d.notes}</div>}
              </div>
              <div className="text-end">
                <div className="mb-1"><span className="badge bg-secondary">{d.status}</span></div>
                <div>
                  <select className="form-select mb-2" defaultValue="" onChange={e=>updateStatus(d._id, e.target.value)}>
                    <option value="">Update status</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button className="btn btn-sm btn-outline-primary" onClick={()=>addNotes(d._id)}>Add note</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {list.length===0 && <div>No defects yet.</div>}
    </div>
  );
}
