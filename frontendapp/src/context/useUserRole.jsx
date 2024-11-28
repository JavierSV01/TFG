import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

// Crear el contexto
const UserRoleContext = createContext()

// Proveedor del contexto
export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    // Recuperar el rol desde localStorage al cargar la aplicación
    return localStorage.getItem('userRole') || null
  })
  const [logueado, setLogueado] = useState(() => {
    // Determinar el estado inicial de logueado basado en la existencia de un rol
    return !!localStorage.getItem('userRole')
  })

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (!logueado) {
          setRole(null)
          localStorage.removeItem('userRole') // Limpiar localStorage si no está logueado
        } else {
          const response = await axios.get(ENDPOINTS.USER.ROL) // Endpoint que devuelve el rol
          setRole(response.data.role) // 'entrenador' o 'cliente'
          localStorage.setItem('userRole', response.data.role) // Guardar en localStorage
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole(null)
        setLogueado(false) // Asegurarse de limpiar el estado si hay un error
        localStorage.removeItem('userRole')
      }
    }

    fetchUserRole()
  }, [logueado])

  return (
    <UserRoleContext.Provider value={{ role, setLogueado }}>
      {children}
    </UserRoleContext.Provider>
  )
}

// Custom hook para usar el contexto
export const useUserRole = () => useContext(UserRoleContext)
