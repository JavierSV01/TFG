import React, { useEffect, useState, useRef } from 'react'
import { Box, Flex, Text, Input, Button, ChakraProvider } from '@chakra-ui/react'
import Navbar from '../componentes/Navbar'
import colors from '../constantes/colores'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { useUserNameId } from '../hooks/useUserNameId'

function PaginaUnChat () {
  const socket = io('http://' + process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT)
  const { idChat } = useParams()
  const { authenticated, message } = useAuthCheck()
  const { username } = useUserNameId()

  const [chatData, setChatData] = useState(null)
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        axios.defaults.withCredentials = true
        const response = await axios.get(ENDPOINTS.CHAT.GETCHATBYID + `?chat_id=${idChat}`)
        setChatData(response.data)
        console.log(chatData)
        setRoom(response.data._id)
      } catch (error) {
        console.error(error)
      }
    }

    fetchChatData()
  }, [idChat])

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
        socket.emit('leave_room', { room })
      }
    }
  }, [room])

  const handlerSendMsg = async () => {
    console.log(inputRef.current.value)
    const message = inputRef.current.value
    if (message !== '') {
      if (message && room && username) {
        const timestamp = new Date().toISOString()
        socket.emit('send_message', { // Emitir evento de Socket.IO
          username,
          message,
          room,
          timestamp
        })
        inputRef.current.value = ''
      }
    }
  }

  if (!authenticated) {
    return <div>{message}</div>
  } else {
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
            {messages.map((msg, index) => (
              <Text key={index}>{msg.sender_id + ' ' + msg.message + ' ' + msg.timestamp}</Text>
            ))}
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
