import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { useClientInfo } from '../hooks/useClientInfo'
import { DietaEstatica } from '../componentes/DietaEstatica'
export function PaginaDietaCliente () {
  const { authenticated, message } = useAuthCheck()
  const { usuario } = useParams()
  const { userData, loading, error } = useClientInfo(usuario)

  if (!authenticated) {
    return <div>{message}</div>
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <ChakraProvider>

      {userData.asociacion?.map((asociacion, idx) => {
        const [detalle] = asociacion.dietaData.dieta
        return (
          <div key={asociacion._id.$oid} alignItems='center'>

            <DietaEstatica detalle={detalle} />
          </div>
        )
      })}

    </ChakraProvider>
  )
}
