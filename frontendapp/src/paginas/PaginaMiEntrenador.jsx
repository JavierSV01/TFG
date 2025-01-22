import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Heading, Text, Button, Divider, AbsoluteCenter } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import useMisAsociaciones from '../hooks/useMisAsociaciones'
import colors from '../constantes/colores'
import { useUserNameId } from '../hooks/useUserNameId'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export function PaginaMiEntrenador () {
  const { authenticated, message } = useAuthCheck()
  const { username, loading } = useUserNameId()
  const { entrenador } = useParams()
  const asociaciones = useMisAsociaciones()
  const asociacion = asociaciones.find(asociacion => asociacion.usuarioEntrenador === entrenador)
  const [chatid, setchatid] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchChatData = async () => {
      if (!loading) {
        try {
          axios.defaults.withCredentials = true
          const response = await axios.get(ENDPOINTS.CHAT.EXIST + `?id1=${username}&id2=${entrenador}`)
          setchatid(response.data.chat_id)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchChatData()
  }, [username, entrenador, loading])

  if (!authenticated) {
    return <div>{message}</div>
  } else if (!asociacion) {
    return <div>Usted no esta siendo asesorado por {entrenador}</div>
  } else {
    return (
      <ChakraProvider>
        <Navbar />
        <Box bg={colors.neutral} color={colors.white} minH='100vh' p={2}>

          <Heading textAlign='center' size='lg' m={4} textColor={colors.primary}>Asesoria de {entrenador}</Heading>
          <Box display='flex' justifyContent='center' mt={4}>
            <Button
              bgColor={colors.secondary} textColor={colors.white}
              _hover={{ bgColor: colors.primary, color: colors.neutral }}
              onClick={() => navigate(`/chat/${chatid}`)}
            >
              Botón Centrado
            </Button>
          </Box>
          <Box position='relative' padding='10'>
            <Divider borderColor={colors.primary} />
            <AbsoluteCenter textColor={colors.primary} bg={colors.neutral} px='4' fontSize={24}>Entrenamientos</AbsoluteCenter>
          </Box>
          {asociacion.entrenamientos?.map((entrenamiento, idx) => {
            // Convierte la fecha a formato local
            const fecha = new Date(entrenamiento.fecha.$date).toLocaleString()
            // Asume que solo quieres mostrar el primer elemento del array "entrenamiento"
            const [detalle] = entrenamiento.entrenamiento

            return (
              <div key={idx} alignItems='center'>
                <Box
                  key={idx}
                  p={2}
                  mb={2}
                  pl={{ base: 0, lg: 20 }}
                  pr={{ base: 0, lg: 20 }}
                  ml={10}
                  mr={10}
                  display='flex'
                  alignItems='center'
                  textColor={colors.primary}
                >
                  <Box width='70%' m={2} p={2}>
                    <Text>Título: {detalle?.title}</Text>
                    <Text>Descripción: {detalle?.description}</Text>
                    <Text>Fecha: {fecha}</Text>
                  </Box>
                  <Box width='30%' m={2} p={2} textAlign='end'>
                    <Button
                      bgColor={colors.secondary} textColor={colors.white}
                      _hover={{ bgColor: colors.primary, color: colors.neutral }}
                      onClick={() => navigate(`/entrenador/${entrenador}/${entrenamiento._id.$oid}`)}
                    >
                      Ver
                    </Button>
                  </Box>

                </Box>
                <Box position='relative' pl={12} pr={12}>
                  <Divider borderColor={colors.white} />
                </Box>
              </div>

            )
          })}
        </Box>
      </ChakraProvider>
    )
  }
}
