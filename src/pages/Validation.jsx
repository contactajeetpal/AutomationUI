import React, { useMemo, useState } from 'react'

function validate(values){
  const errors = {}
  if(!values.name?.trim()) errors.name = 'Name is required'
  else if(values.name.trim().length < 3) errors.name = 'Name must be at least 3 characters'

  if(!values.email?.trim()) errors.email = 'Email is required'
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email is invalid'

  if(values.age === '' || values.age === null || values.age === undefined) errors.age = 'Age is required'
  else if(!/^\d+$/.test(String(values.age))) errors.age = 'Age must be a whole number'
  else if(Number(values.age) < 1 || Number(values.age) > 120) errors.age = 'Age must be between 1 and 120'

  if(!values.password) errors.password = 'Password is required'
  else if(values.password.length < 8) errors.password = 'Password must be at least 8 characters'
  else if(!/\d/.test(values.password)) errors.password = 'Password must include a number'

  if(values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match'

  return errors
}

export default function Validation(){
  const [values, setValues] = useState({ name:'', email:'', age:'', password:'', confirmPassword:'' })
  const errors = useMemo(()=> validate(values), [values])
  const isValid = Object.keys(errors).length === 0

  const onSubmit = (e)=>{
    e.preventDefault()
    alert(isValid ? 'Form is valid!' : 'Form has errors.')
  }

  const field = (id, label, input)=> (
    <div style={{marginBottom:12}}>
      <label htmlFor={id} style={{display:'block', marginBottom:6}}>{label}</label>
      {input}
      <div className="toast" data-testid={`error-${id}`} style={{color: errors[id] ? '#b91c1c' : 'var(--muted)'}}>
        {errors[id] || 'Looks good.'}
      </div>
    </div>
  )

  return (
    <section className="card" data-testid="page-validation">
      <div className="head">
        <h2>Validation Playground</h2>
        <p className="sub">Try valid/invalid inputs; messages & states update live</p>
      </div>
      <div className="body">
        <form onSubmit={onSubmit} noValidate>
          {field('name','Full Name',
            <input id="name" className="input" placeholder="Ada Lovelace"
              value={values.name} onChange={e=>setValues(v=>({...v, name:e.target.value}))}
              aria-invalid={!!errors.name} data-testid="input-name" />)}

          {field('email','Email Address',
            <input id="email" className="input" placeholder="ada@lovelace.org"
              value={values.email} onChange={e=>setValues(v=>({...v, email:e.target.value}))}
              aria-invalid={!!errors.email} data-testid="input-email" />)}

          {field('age','Age',
            <input id="age" className="input" placeholder="28"
              value={values.age} onChange={e=>setValues(v=>({...v, age:e.target.value}))}
              inputMode="numeric" aria-invalid={!!errors.age} data-testid="input-age" />)}

          {field('password','Password',
            <input id="password" type="password" className="input" placeholder="********"
              value={values.password} onChange={e=>setValues(v=>({...v, password:e.target.value}))}
              aria-invalid={!!errors.password} data-testid="input-password" />)}

          {field('confirmPassword','Confirm Password',
            <input id="confirmPassword" type="password" className="input" placeholder="********"
              value={values.confirmPassword} onChange={e=>setValues(v=>({...v, confirmPassword:e.target.value}))}
              aria-invalid={!!errors.confirmPassword} data-testid="input-confirm" />)}

          <div className="row" style={{marginTop:12}}>
            <button className="button primary" type="submit" disabled={!isValid} data-testid="btn-submit">
              Submit
            </button>
            {!isValid && <span className="toast" data-testid="form-invalid-hint">Form invalid — fix errors to enable submit.</span>}
            {isValid && <span className="toast" data-testid="form-valid-hint" style={{color:'#059669'}}>All good — ready to submit.</span>}
          </div>
        </form>
      </div>
    </section>
  )
}
