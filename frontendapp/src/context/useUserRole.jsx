import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Crear el contexto
const UserRoleContext = createContext()

// Proveedor del contexto
export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(null)

  const backendHost = process.env.REACT_APP_BACKEND_HOST
  const backendPort = process.env.REACT_APP_BACKEND_PORT
  const backendUrl = 'http://' + backendHost + ':' + backendPort

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(backendUrl + '/user-role') // Endpoint que devuelve el rol
        setRole(response.data.role) // 'entrenador' o 'cliente'
      } catch (error) {
        console.error('Error fetching user role:', error)
      }
    }

    fetchUserRole()
  }, [backendUrl])

  return (
    <UserRoleContext.Provider value={role}>
      {children}
    </UserRoleContext.Provider>
  )
}

// Custom hook para usar el contexto
export const useUserRole = () => useContext(UserRoleContext)
