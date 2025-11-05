import React, { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  async function doLogin(){
    try{
      const res = await axios.post('/api/auth/login',{email,password});
      localStorage.setItem('adminToken', res.data.token);
      window.location.href = '/admin/';
    }catch(e){ alert(e.response?.data?.error || 'Login failed') }
  }
  return (
    <div style={{maxWidth:420,margin:'80px auto',padding:20,background:'#071826',borderRadius:8}}>
      <h2>Admin Login</h2>
      <input style={{width:'100%',padding:10,marginBottom:8}} placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input style={{width:'100%',padding:10,marginBottom:8}} placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} type="password"/>
      <button style={{padding:10,background:'#7c3aed',color:'#021',border:0,borderRadius:8}} onClick={doLogin}>Login</button>
    </div>
  )
}