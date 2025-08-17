import React, { useEffect, useMemo, useRef, useState } from 'react'

const COUNTRIES = [
  "Australia","Austria","Argentina","Brazil","Canada","Denmark","Finland","France","Germany","India",
  "Indonesia","Ireland","Italy","Japan","Mexico","Netherlands","New Zealand","Norway","Singapore",
  "South Africa","Spain","Sweden","Switzerland","United Kingdom","United States"
]

function useDebounced(value, delay=150){
  const [v, setV] = useState(value)
  useEffect(()=>{ const t=setTimeout(()=>setV(value), delay); return ()=>clearTimeout(t)},[value,delay])
  return v
}

export default function Home(){
  const [framework, setFramework] = useState('react')
  const [dblCount, setDblCount] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [env, setEnv] = useState('dev')
  const [prefs, setPrefs] = useState({ tnc:false, emails:false, sms:false })
  const [q, setQ] = useState('')
  const debounced = useDebounced(q, 150)
  const [activeIdx, setActiveIdx] = useState(-1)
  const suggestions = useMemo(()=>{
    if(!debounced) return []
    const key = debounced.toLowerCase()
    return COUNTRIES.filter(c=>c.toLowerCase().includes(key)).slice(0,8)
  }, [debounced])
  const [rows, setRows] = useState([
    { id: 101, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 102, name: 'John Smith', email: 'john@example.com' }
  ])
  const [rowName,setRowName] = useState('')
  const [rowEmail,setRowEmail] = useState('')
  const childRef = useRef(null)
  const scrollRef = useRef(null)
  const [secret, setSecret] = useState(false)

  useEffect(()=>{
    if(!file) return
    const url = URL.createObjectURL(file)
    setFilePreview(url)
    return ()=>URL.revokeObjectURL(url)
  },[file])

  const addRow = ()=>{
    if(!rowName || !rowEmail) return
    setRows(r=>[{ id: Date.now(), name: rowName, email: rowEmail }, ...r])
    setRowName(''); setRowEmail('')
  }
  const removeRow = (id)=> setRows(r=>r.filter(x=>x.id!==id))

  const openChild = ()=>{
    const win = window.open('/child.html','qa-child','width=600,height=420')
    if(win){
      childRef.current = win
      win.document.write(`
        <html><head><title>Child Window</title>
        <style>body{font-family:system-ui;background:#fff;color:#111;padding:24px}
        h2{margin:0 0 8px} .btn{padding:8px 12px;border-radius:10px;border:1px solid #aaa;background:#f7f7f7;color:#111;cursor:pointer}
        </style></head><body>
        <h2 id="title">Child Window</h2>
        <p data-testid="child-window-text">This is a new window. Switch to me in your test.</p>
        <button class="btn" onclick="window.opener && window.opener.postMessage({from:'child',msg:'hello'},'*')" data-testid="child-ping-parent">Ping parent</button>
        <button class="btn" onclick="window.close()" data-testid="child-close-btn" style="margin-left:8px">Close</button>
        </body></html>`)
      win.document.close()
    }
  }
  const postToChild = ()=> childRef.current?.postMessage({ from:'parent', msg:'hello child'}, '*')

  useEffect(()=>{
    const handler = (e)=>{ console.log('Parent received:', e.data) }
    window.addEventListener('message', handler)
    return ()=>window.removeEventListener('message', handler)
  },[])

  const scrollTo = (pos)=>{
    const el = scrollRef.current; if(!el) return
    el.scrollTo({ top: pos==='top' ? 0 : el.scrollHeight, behavior:'smooth' })
  }

  return (
    <div className="grid cols-2">

      <section className="card" data-testid="card-dropdown">
        <div className="head"><h2>Dropdown</h2><p className="sub">Select framework</p></div>
        <div className="body">
          <label htmlFor="framework">Framework</label>
          <select id="framework" className="select" value={framework} onChange={(e)=>setFramework(e.target.value)} data-testid="dropdown-basic" aria-label="Framework">
            <option value="react">React</option><option value="angular">Angular</option><option value="vue">Vue</option><option value="svelte">Svelte</option>
          </select>
          <div className="toast">Selected: <strong data-testid="dropdown-value">{framework}</strong></div>
        </div>
      </section>

      <section className="card" data-testid="card-dbl-hover">
        <div className="head"><h2>Double Click & Hover</h2><p className="sub">Trigger events by user interactions</p></div>
        <div className="body">
          <div className="row">
            <button className="button primary" onDoubleClick={()=>setDblCount(c=>c+1)} data-testid="btn-double-click" aria-label="Double click button">Double‑click me</button>
            <div>Double clicks: <strong data-testid="dbl-count">{dblCount}</strong></div>
          </div>
          <div className={`hoverbox`} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} data-testid="hover-zone" aria-live="polite" style={{marginTop:12}}>
            {hovered ? 'Hovered!' : 'Hover over this box'}
          </div>
          <div className="hover-group" style={{position:'relative', marginTop:12}}>
            <button className="button secondary" data-testid="btn-hover-reveal">Hover to reveal menu</button>
            <div className="hover-menu" role="menu" data-testid="hover-revealed">
              <p className="toast">Hidden on load, visible only on hover</p>
              <div className="row" style={{marginTop:8}}>
                <button className="button" data-testid="hover-menu-action-1">Action 1</button>
                <button className="button" data-testid="hover-menu-action-2">Action 2</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card" data-testid="card-file-upload">
        <div className="head"><h2>File Upload</h2><p className="sub">Upload any file — image preview supported</p></div>
        <div className="body">
          <input id="file" type="file" className="input" onChange={e=>setFile(e.target.files?.[0] ?? null)} data-testid="input-file" aria-label="File upload"/>
          {file && <div className="toast" style={{marginTop:8}}>Selected: <strong data-testid="file-name">{file.name}</strong></div>}
          {filePreview && <div style={{marginTop:10}}><img src={filePreview} alt="Preview" style={{maxHeight:180, borderRadius:10, border:'1px solid var(--border)'}} data-testid="file-preview"/></div>}
        </div>
      </section>

      <section className="card" data-testid="card-choice">
        <div className="head"><h2>Radios & Checkboxes</h2><p className="sub">Pick environment & preferences</p></div>
        <div className="body">
          <div className="row" role="radiogroup" aria-label="Environment">
            {['dev','staging','prod'].map(v=> (
              <label key={v} className="row" style={{border:'1px solid var(--border)', borderRadius:10, padding:'8px 10px'}}>
                <input type="radio" name="env" value={v} checked={env===v} onChange={()=>setEnv(v)} data-testid={`radio-${v}`} />
                <span style={{marginLeft:6, textTransform:'capitalize'}}>{v}</span>
              </label>
            ))}
          </div>
          <hr style={{border:'none', borderTop:'1px solid var(--border)', margin:'12px 0'}} />
          <div className="row" style={{alignItems:'flex-start', flexDirection:'column', gap:8}}>
            {[['tnc','Accept Terms & Conditions'],['emails','Receive product emails'],['sms','Receive SMS alerts']].map(([k,label])=> (
              <label key={k} className="row" style={{alignItems:'center'}}>
                <input type="checkbox" checked={prefs[k]} onChange={(e)=>setPrefs(p=>({...p,[k]:e.target.checked}))} data-testid={`checkbox-${k}`} />
                <span style={{marginLeft:6}}>{label}</span>
              </label>
            ))}
          </div>
          <div className="toast" data-testid="choice-summary" style={{marginTop:8}}>
            Env: <strong>{env}</strong> · Terms: {prefs.tnc?'yes':'no'} · Emails: {prefs.emails?'yes':'no'} · SMS: {prefs.sms?'yes':'no'}
          </div>
        </div>
      </section>

      <section className="card" data-testid="card-autosuggest">
        <div className="head"><h2>Auto-suggestion</h2><p className="sub">Type a country name (e.g., “Aus”)</p></div>
        <div className="body">
          <div style={{position:'relative'}}>
            <input id="country" className="input" placeholder="Start typing…" value={q}
                   onChange={(e)=>{ setQ(e.target.value); setActiveIdx(-1); }}
                   onKeyDown={(e)=>{
                     if(!suggestions.length) return
                     if(e.key==='ArrowDown'){ e.preventDefault(); setActiveIdx(i=>Math.min(i+1, suggestions.length-1)) }
                     else if(e.key==='ArrowUp'){ e.preventDefault(); setActiveIdx(i=>Math.max(i-1, 0)) }
                     else if(e.key==='Enter' && activeIdx>=0){ setQ(suggestions[activeIdx]) }
                   }}
                   role="combobox" aria-expanded={suggestions.length>0} aria-controls="country-listbox" aria-autocomplete="list"
                   data-testid="autosuggest-input"
            />
            {suggestions.length>0 && (
              <ul id="country-listbox" role="listbox" className="card" style={{position:'absolute', zIndex:10, width:'100%', marginTop:6}} data-testid="autosuggest-list">
                <div className="body" style={{padding:0}}>
                  {suggestions.map((s,i)=> (
                    <li key={s} role="option" aria-selected={i===activeIdx}
                        onMouseDown={()=>setQ(s)}
                        style={{padding:'10px 12px', cursor:'pointer', background: i===activeIdx ? '#eff6ff' : 'transparent'}}
                    >{s}</li>
                  ))}
                </div>
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="card" data-testid="card-window">
        <div className="head"><h2>Window & Tab</h2><p className="sub">Open a new tab/window and switch handles</p></div>
        <div className="body">
          <div className="row">
            <a className="button" href="https://example.com" target="_blank" rel="noreferrer" data-testid="link-new-tab">Open Example.com (new tab)</a>
            <button className="button primary" onClick={openChild} data-testid="btn-open-child">Open Child Window</button>
            <button className="button" onClick={postToChild} data-testid="btn-postmessage">PostMessage → Child</button>
          </div>
          <p className="toast" style={{marginTop:8}}>Use your automation to switch to the child window and validate its contents.</p>
        </div>
      </section>

      <section className="card" data-testid="card-static-table">
        <div className="head"><h2>Static Table</h2><p className="sub">Non‑editable dataset</p></div>
        <div className="body">
          <table className="table">
            <thead><tr><th>Name</th><th>Role</th><th>Location</th></tr></thead>
            <tbody>
              {[
                { id:1, name:'Ada Lovelace', role:'Backend', location:'London' },
                { id:2, name:'Grace Hopper', role:'Platform', location:'New York' },
                { id:3, name:'Alan Turing', role:'ML', location:'Manchester' },
                { id:4, name:'Katherine Johnson', role:'Data', location:'Virginia' },
              ].map(u=> (
                <tr key={u.id} data-testid={`static-row-${u.id}`}><td>{u.name}</td><td>{u.role}</td><td>{u.location}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" data-testid="card-dynamic-table">
        <div className="head"><h2>Dynamic Table</h2><p className="sub">Add & remove rows</p></div>
        <div className="body">
          <div className="row">
            <input className="input" placeholder="Full name" value={rowName} onChange={e=>setRowName(e.target.value)} data-testid="dyn-name" />
            <input className="input" placeholder="Email" value={rowEmail} onChange={e=>setRowEmail(e.target.value)} data-testid="dyn-email" />
            <button className="button primary" onClick={addRow} data-testid="dyn-add">Add</button>
          </div>
          <table className="table" style={{marginTop:10}}>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {rows.map(r=> (
                <tr key={r.id} data-testid={`dyn-row-${r.id}`}>
                  <td>{r.id}</td><td>{r.name}</td><td>{r.email}</td>
                  <td className="actions"><button className="button danger" onClick={()=>removeRow(r.id)} data-testid={`dyn-remove-${r.id}`}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" data-testid="card-scroll" style={{gridColumn:'1 / -1'}}>
        <div className="head"><h2>Scroll Lab</h2><p className="sub">Scrollable container + programmatic scroll + mount/unmount panel</p></div>
        <div className="body">
          <div className="row" style={{marginBottom:8}}>
            <button className="button" onClick={()=>scrollTo('top')} data-testid="btn-scroll-top">Top</button>
            <button className="button primary" onClick={()=>scrollTo('bottom')} data-testid="btn-scroll-bottom">Bottom</button>
            <button className="button secondary" onClick={()=>setSecret(s=>!s)} data-testid="btn-toggle-secret">Toggle Secret Panel</button>
          </div>
          {secret && <div className="hoverbox" data-testid="secret-panel">This panel mounts/unmounts. Great for wait/visibility tests.</div>}
          <div ref={scrollRef} className="scroll-area" data-testid="scroll-area">
            {Array.from({length:30}).map((_,i)=> (
              <div key={i} className="scroll-item" data-testid={`scroll-item-${i+1}`}>Scroll item {i+1}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="row" style={{justifyContent:'space-between', marginTop:16}}>
        <p className="toast">Tip: every interactive element has a <span style={{fontFamily:'monospace'}}>data-testid</span> for stable selectors.</p>
        <div className="row">
          <button className="button" onClick={()=>window.location.reload()} data-testid="btn-reset">Reset page</button>
          <button className="button linklike" onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} data-testid="btn-back-to-top">Back to top</button>
        </div>
      </div>
    </div>
  )
}
