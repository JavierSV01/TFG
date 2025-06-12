import React, { useEffect, useState, useRef } from 'react'
import { Box, Flex, Text, Input, Button, ChakraProvider, HStack } from '@chakra-ui/react'
import colors from '../constantes/colores'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { useUserNameId } from '../hooks/useUserNameId'
import FotoDePerfil from '../componentes/FotoDePerfil'

function formatearFecha (fechaString) {
  const fecha = new Date(fechaString) // Convertir string a objeto Date

  const dia = fecha.getDate().toString().padStart(2, '0')
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const anio = fecha.getFullYear()
  const horas = fecha.getHours().toString().padStart(2, '0')
  const minutos = fecha.getMinutes().toString().padStart(2, '0')

  return `${dia}-${mes}-${anio} ${horas}:${minutos}`
}

function PaginaUnChat () {
  const socket = io(process.env.REACT_APP_BACKEND_HOST)
  const { idChat } = useParams()
  const { authenticated, message } = useAuthCheck()
  const { username } = useUserNameId()
  const otherUsername = useRef('') // No se usa en este código, pero se puede usar si es necesario

  const [chatData, setChatData] = useState(null)
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const inputRef = useRef(null)
  const fetchChatData = async () => {
    try {
      axios.defaults.withCredentials = true
      const response = await axios.get(ENDPOINTS.CHAT.GETCHATBYID + `?chat_id=${idChat}`)
      setChatData(response.data)
      response.data.usuarios.forEach(user => {
        if (user !== username) {
          otherUsername.current = user
        }
      })
      console.log(otherUsername.current)
      if (response.data.mensajes) {
        setMessages(response.data.mensajes)
      }
      setRoom(response.data._id)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchChatData()
  }, [idChat, username])

  useEffect(() => {
    if (room) { // Esperar a que se carguen username, room y chatData
      socket.emit('join_room', { room })

      const handleNewMessage = (msg) => {
        console.log(msg)
        setMessages(prevMessages => [...prevMessages, msg])
      }

      const handleStatus = (data) => {
        console.log(data)
      }

      socket.on('new_message', handleNewMessage)
      socket.on('status', handleStatus)

      socket.on('disconnect', () => {
        console.log('Desconectado del servidor')
      })

      return () => {
        socket.off('new_message', handleNewMessage) // Importante: remover el listener específico
        socket.off('status', handleStatus) // Importante: remover el listener específico
        socket.off('disconnect')
        socket.emit('leave_room', { room, username })
      }
    }
  }, [room, username, socket, chatData]) // Dependencias para que se ejecute cuando room o username cambien

  const handlerSendMsg = async () => {
    console.log(inputRef.current.value)
    const message = inputRef.current.value
    if (message !== '') {
      if (message && room && username) {
        const timestamp = new Date().toISOString()
        socket.emit('send_message', {
          username,
          message,
          room,
          timestamp
        })

        inputRef.current.value = ''
      }
    }
  }

  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]) // Dependencia en 'messages' para que se actualice al cambiar los mensajes

  if (!authenticated) {
    return <div>{message}</div>
  } if (!chatData || !username) {
    return (
      <ChakraProvider>
        <Flex direction='column' height='100vh' justifyContent='center' alignItems='center'>
          <Text fontSize='2xl' fontWeight='bold'>Cargando...</Text>
        </Flex>
      </ChakraProvider>
    )
  } else {
    return (
      <ChakraProvider>
        <Flex direction='column' height='100vh'>
          <Box bg={colors.neutral} py={4} display='flex' justifyContent='center'>
            <HStack>
              <Box width={{ base: '60px', md: '90px' }}>
                <FotoDePerfil username={otherUsername.current} />
              </Box>
              <Text fontSize='2xl' fontWeight='bold'>
                {otherUsername.current}
              </Text>
            </HStack>
          </Box>

          <Box
            ref={messagesContainerRef}
            flex='1'
            overflowY='auto'
            p={4}
            bg='white'
            border='1px solid'
            borderColor='gray.200'
            paddingStart={{
              base: '10px',
              sm: '20px',
              md: '50px',
              lg: '100px',
              xl: '150px'
            }}
            paddingEnd={{
              base: '10px',
              sm: '20px',
              md: '50px',
              lg: '100px',
              xl: '150px'
            }}
            mb='70px'
          >
            {messages.map((msg, index) => (
              <Flex
                key={index}
                justifyContent={msg.username === username ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                <Box
                  maxW='70%' // Ajusta este valor según tus necesidades
                  minW={{
                    base: '90%',
                    sm: '85%',
                    md: '75%',
                    lg: '65%',
                    xl: '55%'
                  }}
                  p={2}
                  border='2px solid'
                  borderColor={colors.neutral}
                  borderRadius='md'
                >
                  <Flex alignItems='baseline' justifyContent={msg.username === username ? 'flex-end' : 'flex-start'}>
                    <Text fontWeight='bold' mr={2}>{msg.username}</Text>
                    <Text>{msg.mensaje}</Text>
                  </Flex>
                  <Flex alignItems='baseline' justifyContent={msg.username === username ? 'flex-end' : 'flex-start'}>
                    <Text fontSize='sm' color={colors.neutral}>{formatearFecha(msg.fecha)}</Text>
                  </Flex>
                </Box>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
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
              <Input
                ref={inputRef}
                placeholder='Escribe tu mensaje...'
                mr={2}
                bg={colors.white}
              />
              <Button
                onClick={handlerSendMsg}
                bg={colors.accent}
                variant='solid'
                color={colors.white}
                _hover={{ bg: colors.secondary }}
              >
                Enviar
              </Button>
            </Flex>
          </Box>
        </Flex>
      </ChakraProvider>
    )
  }
}

export default PaginaUnChat
