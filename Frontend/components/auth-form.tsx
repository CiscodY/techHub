"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface AuthFormProps {
  onClose: () => void
  onLoginSuccess: (user: { name: string; email: string }) => void
}

export default function AuthForm({ onClose, onLoginSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [msg, setMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg("")

    if (!formData.email || !formData.password || (mode === "signup" && !formData.name)) {
      setMsg("Por favor completa todos los campos")
      return
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setMsg("Las contraseñas no coinciden")
      return
    }

    try {
      const url = mode === "signup" ? "/api/usuario/registrar" : "/api/auth/login"
      const body =
        mode === "signup"
          ? { nombre: formData.name, email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password }

      const res = await apiFetch(url, { method: "POST", body: JSON.stringify(body) })

      // Para login puedes ajustar según lo que retorne tu backend
      const userName = mode === "signup" ? formData.name : res?.nombre ?? "Usuario"
      onLoginSuccess({ name: userName, email: res?.email ?? formData.email })
      setMsg(`${mode === "login" ? "Login" : "Registrado"} exitoso`)
    } catch (err: any) {
      if (Array.isArray(err)) setMsg(err.join(", "))
      else setMsg(typeof err === "string" ? err : JSON.stringify(err))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border p-4 sm:p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-foreground">{mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre completo</label>
              <Input
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirmar contraseña</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <Button type="submit" size="lg" className="w-full">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>
          {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
        </form>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-3">
            {mode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
          </Button>
        </div>
      </div>
    </div>
  )
}