import React from 'react'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { ModificarDieta } from '../componentes/ModificarDieta'
import { useParams } from 'react-router-dom'

export function PaginaModificarDieta () {
  const { authenticated, message } = useAuthCheck()

  const { tituloPrevio } = useParams()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ModificarDieta tituloPrevio={tituloPrevio} />
  )
}
