import React from 'react'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { CrearDieta } from '../componentes/CrearDieta'

export function PaginaCrearDieta () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <CrearDieta />
  )
}
