import React, { useState } from 'react'

export default function Alerts(){
  const [lastAlert, setLastAlert] = useState('')
  const [confirmResult, setConfirmResult] = useState('')
  const [promptValue, setPromptValue] = useState('')

  const handleAlert = ()=>{
    window.alert('This is a JS alert')
    setLastAlert('alert-shown')
  }

  const handleConfirm = ()=>{
    const ok = window.confirm('Do you confirm this action?')
    setConfirmResult(ok ? 'accepted' : 'rejected')
  }

  const handlePrompt = ()=>{
    const v = window.prompt('Enter some text:', 'hello')
    setPromptValue(v === null ? '(cancelled)' : v)
  }

  return (
    <section className="card" data-testid="page-alerts">
      <div className="head">
        <h2>JavaScript Alerts</h2>
        <p className="sub">Trigger alert / confirm / prompt and assert results</p>
      </div>
      <div className="body">
        <div className="row">
          <button className="button primary" onClick={handleAlert} data-testid="btn-alert">Show Alert</button>
          <button className="button" onClick={handleConfirm} data-testid="btn-confirm">Show Confirm</button>
          <button className="button secondary" onClick={handlePrompt} data-testid="btn-prompt">Show Prompt</button>
        </div>
        <div style={{marginTop:12}}>
          <div className="toast">Last alert: <strong data-testid="alert-status">{lastAlert || '(none)'}</strong></div>
          <div className="toast">Confirm result: <strong data-testid="confirm-result">{confirmResult || '(none)'}</strong></div>
          <div className="toast">Prompt value: <strong data-testid="prompt-value">{promptValue || '(none)'}</strong></div>
        </div>
      </div>
    </section>
  )
}
