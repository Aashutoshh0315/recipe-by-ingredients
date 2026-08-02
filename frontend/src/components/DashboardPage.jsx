import { useState, useEffect } from 'react';
import { API } from '../lib/api';

export default function DashboardPage({ savedRecipes, onNavigate }) {
  const savedCount = savedRecipes.length;
  const [totalRecipes, setTotalRecipes] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API('/recipes');
        if (res.ok) {
          const data = await res.json();
          if (mounted) setTotalRecipes(data.length);
        }
      } catch (e) {
        // ignore — stat just won't show
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#1A1612', margin:'0 0 4px' }}>Dashboard</h1>
      <p style={{ color:'#8A7E74', margin:'0 0 24px', fontSize:15 }}>Your personal cooking hub.</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:32 }}>
        {[
          ['❤️', savedCount, 'Saved recipes'],
          ['🍳', totalRecipes != null ? totalRecipes : '…', 'Total recipes'],
        ].map(([icon,val,label]) => (
          <div key={label} style={{ background:'#fff', border:'1px solid #F4F0E8', borderRadius:14, padding:'18px 16px', textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#1A1612' }}>{val}</div>
            <div style={{ fontSize:12, color:'#8A7E74', marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize:18, fontWeight:700, color:'#1A1612', margin:'0 0 12px' }}>Quick Actions</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
        {[
          { icon:'🔍', label:'Search by ingredients', desc:'Find recipes using what you have',   page:'search', bg:'#FFF0E8' },
          { icon:'❤️', label:'View saved recipes',     desc:`${savedCount} recipe${savedCount!==1?'s':''} bookmarked`, page:'saved', bg:'#FAEEDA' },
          { icon:'🕘', label:'View history',            desc:'See what you\'ve searched and viewed', page:'history', bg:'#F4F0E8' },
        ].map(a => (
          <div key={a.label} onClick={()=>onNavigate(a.page)}
            style={{ background:a.bg, borderRadius:14, padding:'18px 16px', cursor:'pointer', border:'1px solid #F4F0E8', transition:'transform 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}
          >
            <div style={{ fontSize:32, marginBottom:8 }}>{a.icon}</div>
            <div style={{ fontWeight:700, color:'#1A1612', fontSize:15 }}>{a.label}</div>
            <div style={{ color:'#8A7E74', fontSize:13, marginTop:4 }}>{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}