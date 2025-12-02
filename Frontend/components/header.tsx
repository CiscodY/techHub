"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import AuthForm from "./auth-form"

interface User {
  name: string
  email: string
  image: string
}

export default function Header() {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthForm, setShowAuthForm] = useState(false)

  const handleLoginSuccess = (userData: User) => {
    setUser(userData)
    setIsLogged(true)
    setShowAuthForm(false)
  }

  const handleLogout = () => {
    setIsLogged(false)
    setUser(null)
  }

  return (
    <>
      <header className="bg-blue-900 dark:bg-blue-950 border-b border-blue-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y perfil */}
            <div className="flex items-center gap-3">
              {isLogged && user ? (
                <>
                  <img
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-blue-100">Usuario Premium</p>
                  </div>
                </>
              ) : (
                <div className="text-lg font-bold text-white">TechHub</div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              {isLogged ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white/10 bg-transparent transition-all duration-300 ease-out hover:scale-105"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              ) : (
                <Button
                  onClick={() => setShowAuthForm(true)}
                  className="rounded-full bg-white text-blue-900 hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-105"
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} onLoginSuccess={handleLoginSuccess} />}
    </>
  )
}
