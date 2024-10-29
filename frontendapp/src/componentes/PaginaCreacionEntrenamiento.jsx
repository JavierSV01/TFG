import React from 'react'
import Navbar from './Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { CreacionEntrenamiento } from './CreacionEntrenamiento'

export function PaginaCreacionEntrenamiento () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <div>
      <Navbar />
      <h1>{message}  </h1>
      <h1>Pagina de creacion de entrenemiento  </h1>
      <CreacionEntrenamiento />

    </div>
  )
}
