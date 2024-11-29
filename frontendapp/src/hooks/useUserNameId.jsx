import { useState, useEffect } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export const useUserNameId = () => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        axios.withCredentials = true
        const response = await axios.get(ENDPOINTS.USER.NAME)
        setUsername(response.data.usuario)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsername()
  }, [])

  return { username, loading, error }
}
