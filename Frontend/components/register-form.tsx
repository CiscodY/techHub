'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function RegisterForm() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await apiFetch('/api/usuario/registrar', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password }),
      })
      setMsg(`Registrado: ${res?.email ?? JSON.stringify(res)}`)
    } catch (err: any) {
      if (Array.isArray(err)) setMsg(err.join(', '))
      else setMsg(typeof err === 'string' ? err : JSON.stringify(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 max-w-md">
      <h3 className="text-lg font-semibold mb-2">Registro</h3>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre"
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="block w-full mb-2 p-2 border rounded"
      />
      <button type="submit" className="px-3 py-1 bg-primary text-white rounded">Registrar</button>
      <div className="mt-2 text-sm">{msg}</div>
    </form>
  )
}
