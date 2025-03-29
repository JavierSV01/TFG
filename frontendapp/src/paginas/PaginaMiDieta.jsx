import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import { DietaEstatica } from '../componentes/DietaEstatica'
export function PaginaMiDieta () {
  const { authenticated, message } = useAuthCheck()
  const { entrenador } = useParams()
  const asociaciones = useMisAsociaciones()
  const asociacion = asociaciones.find(asociacion => asociacion.usuarioEntrenador === entrenador)

  if (!authenticated) {
    return <div>{message}</div>
  } else if (!asociacion) {
    return <div>Usted no esta siendo asesorado por {entrenador}</div>
  } else {
    // const fecha = new Date(asociacion.dietaData.fecha.$date).toLocaleString()
    const [detalle] = asociacion.dietaData.dieta
    return (
      <ChakraProvider>
        <DietaEstatica detalle={detalle} />
      </ChakraProvider>
    )
  }
}
