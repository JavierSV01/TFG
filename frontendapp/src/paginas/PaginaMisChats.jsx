import React, { useEffect, useState } from 'react'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { Box, Heading, List, ListItem, Text, ChakraProvider, Divider, HStack, Icon } from '@chakra-ui/react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'
import { useUserNameId } from '../hooks/useUserNameId'
import BotonChat from '../componentes/BotonChat'
import { BellIcon } from '@chakra-ui/icons'
import FotoDePerfil from '../componentes/FotoDePerfil'

const obtenerOtroUsuario = (listaUsuarios, miNombreUsuario) => {
  if (listaUsuarios[0] === miNombreUsuario) {
    return listaUsuarios[1]
  } else if (listaUsuarios[1] === miNombreUsuario) {
    return listaUsuarios[0]
  } else {
    return null // Esto no debería ocurrir si la lista solo tiene los dos usuarios del chat
  }
}

export function PaginaMisChats () {
  const [chats, setChats] = useState([])
  const { authenticated, message } = useAuthCheck()
  const { username } = useUserNameId()

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        axios.defaults.withCredentials = true
        const response = await axios.get(ENDPOINTS.CHAT.GETCHATS)
        setChats(response.data)
        console.log(chats)
      } catch (error) {
        console.error(error)
      }
    }
    fetchChatData()
  }, [])

  if (!authenticated) {
    return <div>{message}</div>
  }
  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={8}>
        <Heading size='lg' mb={4} color={colors.primary}>Mis chats</Heading>
        <List spacing={3} p={4} ml={4} mr={4}>
          {chats.map((chat) => (
            <ListItem key={chat._id} color={colors.primary} p={2}>
              <Divider mb={2} />
              <Box ml={8} mr={8}>
                <HStack justifyContent='space-between'>
                  <HStack>
                    <Box width={{ base: '50px', md: '90px' }}>
                      <FotoDePerfil username={obtenerOtroUsuario(chat.usuarios, username)} />
                    </Box>
                    <Text fontWeight='bold'>
                      {chat.notificar && chat.notificar.includes(username) && (
                        <Icon as={BellIcon} color={colors.accent} ml={2} />
                      )}
                      {obtenerOtroUsuario(chat.usuarios, username)}
                    </Text>
                  </HStack>

                  <BotonChat user1={username} user2={obtenerOtroUsuario(chat.usuarios, username)} />
                </HStack>
              </Box>
              <Divider mt={2} />
            </ListItem>
          ))}
        </List>
      </Box>
    </ChakraProvider>

  )
}
