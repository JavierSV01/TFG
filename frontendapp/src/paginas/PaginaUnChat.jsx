import React, { useEffect } from 'react'
import { Box, Flex, Text, Input, Button, ChakraProvider } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import colors from '../constantes/colores'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { useParams } from 'react-router-dom'

function PaginaUnChat () {
  const { id1, id2 } = useParams()
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        axios.defaults.withCredentials = true
        const response = await axios.get(ENDPOINTS.CHAT.EXIST + `?id1=${id1}&id2${id2}`)
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchChatData()
  }, [id1, id2])
  return (

    <ChakraProvider>
      <Flex direction='column' height='100vh'>
        <Navbar />
        <Box bg={colors.neutral} py={4} textAlign='center'>
          <Text fontSize='2xl' fontWeight='bold'>
            Nombre del Chat
          </Text>
        </Box>

        <Box
          flex='1'
          overflowY='auto'
          p={4}
          bg='white'
          border='1px solid'
          borderColor='gray.200'
          mb='70px'
        >
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
          <Text>Mensaje 1</Text>
          <Text>Mensaje 2</Text>
        </Box>

        <Box
          position='fixed'
          bottom='0'
          width='100%'
          bg={colors.neutral}
          p={4}
          height={70}
        >
          <Flex maxW='container.sm' mx='auto'>
            <Input placeholder='Escribe tu mensaje...' mr={2} bg={colors.white} />
            <Button bg={colors.accent} variant='solid' color={colors.white} _hover={{ bg: colors.secondary }}>
              Enviar
            </Button>
          </Flex>
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default PaginaUnChat
