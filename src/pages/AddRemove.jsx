import React, { useState } from 'react'

export default function AddRemove(){
  const [items, setItems] = useState([])
  const [counter, setCounter] = useState(1)

  const add = ()=>{
    const id = Date.now()
    setItems(prev=> [{ id, label: `Element ${counter}`}, ...prev])
    setCounter(c=>c+1)
  }
  const remove = (id)=> setItems(prev=> prev.filter(i=> i.id !== id))
  const clearAll = ()=> setItems([])

  return (
    <section className="card" data-testid="page-add-remove">
      <div className="head">
        <h2>Add / Remove Elements</h2>
        <p className="sub">Click to add elements; remove them individually</p>
      </div>
      <div className="body">
        <div className="row">
          <button className="button primary" onClick={add} data-testid="btn-add-element">Add Element</button>
          <button className="button danger" onClick={clearAll} data-testid="btn-clear-all">Clear All</button>
        </div>

        <div className="row" style={{marginTop:12, flexDirection:'column', alignItems:'stretch', gap:8}}>
          {items.length === 0 && <p className="toast" data-testid="empty-state">No elements yet. Click “Add Element”.</p>}
          {items.map((it)=> (
            <div key={it.id} className="row" style={{justifyContent:'space-between', border:'1px solid var(--border)', borderRadius:10, padding:'10px 12px'}} data-testid={`added-row-${it.id}`}>
              <span data-testid={`added-label-${it.id}`}>{it.label}</span>
              <div className="row">
                <button className="button" data-testid={`btn-insert-after-${it.id}`} onClick={()=>{
                  const id = Date.now()+1
                  const newItem = { id, label:`Element ${counter}` }
                  setCounter(c=>c+1)
                  setItems(prev=>{
                    const i = prev.findIndex(p=>p.id===it.id)
                    const copy = prev.slice()
                    copy.splice(i+1,0,newItem)
                    return copy
                  })
                }}>Insert After</button>
                <button className="button danger" onClick={()=>remove(it.id)} data-testid={`btn-remove-${it.id}`}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
