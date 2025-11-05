import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UploadForm({ onUpload }){
  const [file,setFile]=useState(null);
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [premium,setPremium]=useState(false);
  return (
    <div style={{background:'#071826',padding:12,borderRadius:8}}>
      <h3>Upload</h3>
      <input type="file" onChange={e=>setFile(e.target.files[0])} /><br/><br/>
      <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:8}}/><br/><br/>
      <textarea placeholder="desc" value={desc} onChange={e=>setDesc(e.target.value)} style={{width:'100%',padding:8}}></textarea><br/><br/>
      <label><input type="checkbox" checked={premium} onChange={e=>setPremium(e.target.checked)}/> Premium</label><br/><br/>
      <button onClick={()=>onUpload(file,title,desc,premium)} style={{padding:8,background:'#7c3aed',border:0,color:'#021',borderRadius:8}}>Upload</button>
    </div>
  )
}

export default function Dashboard(){
  const [contents,setContents]=useState([]);
  const token = localStorage.getItem('adminToken');
  useEffect(()=>{ fetchContents() },[]);
  async function fetchContents(){
    try{
      const res = await axios.get('/api/content',{ headers: { Authorization: 'Bearer '+token }});
      setContents(res.data);
    }catch(e){ console.error(e) }
  }
  async function upload(file,title,desc,isPremium){
    if(!file) return alert('Choose file');
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', desc);
    form.append('isPremium', isPremium);
    await axios.post('/api/content/upload', form, { headers: { Authorization: 'Bearer '+token }});
    fetchContents();
  }
  return (
    <div style={{padding:20}}>
      <h1>Admin Dashboard</h1>
      <UploadForm onUpload={upload} />
      <h2>Contents</h2>
      <ul>
        {contents.map(c=> <li key={c.id} style={{background:'#0b1220',padding:8,margin:6,borderRadius:6}}>{c.title} — {c.mediaType}</li>)}
      </ul>
    </div>
  )
}