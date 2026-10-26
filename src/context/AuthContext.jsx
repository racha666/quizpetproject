import { useState } from 'react'
import { AuthContext } from './authContextObject'
import { loadUser, saveUser } from '../utils/storage'

export function AuthProvider({ children }) {
  // Инициализация «лениво»: loadUser() вызовется один раз при монтировании,
  // а не на каждый рендер
  const [user, setUser] = useState(() => loadUser())

  function login(userData) {
    setUser(userData)
    saveUser(userData)
  }

  function logout() {
    setUser(null)
    saveUser(null)
  }

  function updateUser(updates) {
    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      saveUser(next)
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}