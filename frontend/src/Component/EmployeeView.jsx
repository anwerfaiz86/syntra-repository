import React, { useEffect, useState } from 'react';
import { createDefect, getDefects, API_BASE } from '../api';

export default function EmployeeView(){
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [category,setCategory]=useState('Electrical');
  const [image,setImage]=useState(null);
  const [reporter,setReporter]=useState('emp-1');
  const [list,setList]=useState([]);

  const load = async () => {
    try{
      const data = await getDefects(`?role=employee&id=${reporter}&sortBy=newest`);
      setList(Array.isArray(data)?data:[]);
    }catch(e){ console.error(e); }
  };
  useEffect(()=>{ load(); }, [reporter]);

  const submit = async (e) => {
    e.preventDefault();
    try{
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', desc);
      fd.append('category', category);
      fd.append('reporter', reporter);
      if(image) fd.append('image', image);
      await createDefect(fd);
      setTitle(''); setDesc(''); setImage(null);
      load();
    }catch(err){ alert('Submit failed'); console.error(err); }
  };

  return (
    <div>
      <h5>Employee — Report a defect</h5>
      <form onSubmit={submit} className="mb-4">
        <div className="mb-2"><input required className="form-control" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} /></div>
        <div className="mb-2"><textarea className="form-control" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} /></div>
        <div className="mb-2">
          <select className="form-select" value={category} onChange={e=>setCategory(e.target.value)}>
            <option>Electrical</option>
            <option>Equipment</option>
            <option>Structural</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mb-2">
          <input className="form-control" placeholder="Reporter ID (emp-1)" value={reporter} onChange={e=>setReporter(e.target.value)} />
        </div>
        <div className="mb-2">
          <input type="file" className="form-control" onChange={e=>setImage(e.target.files[0])} />
        </div>
        <button className="btn btn-primary" type="submit">Submit (saves as Open)</button>
      </form>

      <h6>Your reported defects</h6>
      <div>
        {list.length===0 && <div>No reports yet</div>}
        {list.map(d=>(
          <div key={d._id} className="card mb-2">
            <div className="card-body">
              <strong>{d.title}</strong> <small className="text-muted">({d.status})</small>
              <p className="mb-1">{d.description}</p>
              <small className="text-muted">{d.category} • {new Date(d.createdAt).toLocaleString()}</small>
              {d.imageUrl && <div className="mt-2"><img src={`${API_BASE}${d.imageUrl}`} alt="" style={{maxWidth:200}}/></div>}
              {d.notes && <div className="mt-2"><strong>Admin notes:</strong> {d.notes}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
