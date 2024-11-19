import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

// Crear el contexto
const UserRoleContext = createContext()

// Proveedor del contexto
export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(ENDPOINTS.USER.ROL) // Endpoint que devuelve el rol
        setRole(response.data.role) // 'entrenador' o 'cliente'
      } catch (error) {
        console.error('Error fetching user role:', error)
      }
    }

    fetchUserRole()
  }, [])

  return (
    <UserRoleContext.Provider value={role}>
      {children}
    </UserRoleContext.Provider>
  )
}

// Custom hook para usar el contexto
export const useUserRole = () => useContext(UserRoleContext)
