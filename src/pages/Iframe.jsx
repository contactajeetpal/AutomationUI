import React, { useEffect, useState } from 'react'

export default function IframePage(){
  const [message, setMessage] = useState('(none)')

  useEffect(()=>{
    const handler = (e)=>{
      if(typeof e.data === 'object' && e.data.from === 'iframe'){
        setMessage(e.data.msg || '(no payload)')
      }
    }
    window.addEventListener('message', handler)
    return ()=> window.removeEventListener('message', handler)
  },[])

  return (
    <section className="card" data-testid="page-iframe">
      <div className="head">
        <h2>iFrame Playground</h2>
        <p className="sub">Practice switching into iframes & postMessage</p>
      </div>
      <div className="body">
        <iframe
          src="/iframe-content.html"
          title="Practice Frame"
          width="100%"
          height="260"
          style={{border:'1px solid var(--border)', borderRadius:12}}
          data-testid="practice-iframe"
        ></iframe>
        <div className="toast" style={{marginTop:10}}>Message from iframe: <strong data-testid="iframe-msg">{message}</strong></div>
      </div>
    </section>
  )
}
