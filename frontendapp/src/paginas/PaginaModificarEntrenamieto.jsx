import React from 'react'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { ModificacionEntrenamieto } from '../componentes/ModificacionEntreamieto'
import { useParams } from 'react-router-dom'

export function PaginaModificarEntrenamiento () {
  const { tituloPrevio } = useParams()
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ModificacionEntrenamieto tituloPrevio={tituloPrevio} />
  )
}
