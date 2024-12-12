import React from 'react'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { useUserRole } from '../context/useUserRole'
import { MiPerfilCliente } from '../componentes/MiPerfilCliente'
import { MiPerfilEntrenador } from '../componentes/MiPerfilEntrenador'

export function PaginaMiPerfil () {
  const { authenticated, message } = useAuthCheck()
  const { role } = useUserRole()

  if (!authenticated) {
    return <div>{message}</div>
  }
  if (role === 'entrenador') {
    return (
      <MiPerfilEntrenador />
    )
  } else {
    return (
      <MiPerfilCliente />
    )
  }
}
