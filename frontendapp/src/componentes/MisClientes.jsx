import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MisClientes = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://tu-backend-api.com/clientes')
        setClientes(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h1>Mis Clientes</h1>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.id}>{cliente.nombre}</li>
        ))}
      </ul>
    </div>
  )
}

export default MisClientes
