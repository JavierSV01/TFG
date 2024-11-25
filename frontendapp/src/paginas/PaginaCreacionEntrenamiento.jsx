import React from 'react'
import Navbar from '../componentes/Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { CreacionEntrenamiento } from '../componentes/CreacionEntrenamiento'

export function PaginaCreacionEntrenamiento () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <div>
      <Navbar />
      <CreacionEntrenamiento />

    </div>
  )
}
