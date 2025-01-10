import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Box, Button, Input, FormControl, FormLabel, Heading, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ENDPOINTS } from '../constantes/endponits'
import { useUserRole } from '../context/useUserRole'
import colors from '../constantes/colores'

export function Login () {
  // Usar refs para capturar valores de los campos
  const usernameRef = useRef('')
  const passwordRef = useRef('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const userRol = useUserRole()

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const loginData = {
      usuario: username,
      contrasenia: password
    }

    try {
      axios.defaults.withCredentials = true
      const response = await axios.post(ENDPOINTS.USER.LOGIN, loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setMessage(response.data.mensaje || 'Inicio exitoso') // Muestra el mensaje del servidor o uno predeterminado
      userRol.setLogueado(true)
      navigate('/principal')
    } catch (error) {
      const serverMessage = error.response?.data?.mensaje || 'Ocurrió un error. Inténtalo de nuevo.'
      setMessage(serverMessage) // Muestra el mensaje del servidor o uno predeterminado
      console.error('Error:', error)
    }
  }

  return (
    <Box w='100%' display='flex' justifyContent='center' alignItems='center'>
      <Box w='400px' p={8} bg='white' boxShadow='lg' borderRadius='md'>
        <Heading as='h2' size='lg' textAlign='center' mb={6}>
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor='username'>Username:</FormLabel>
              <Input ref={usernameRef} id='username' type='text' placeholder='Enter your username' />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='password'>Password:</FormLabel>
              <Input ref={passwordRef} id='password' type='password' placeholder='Enter your password' />
            </FormControl>
            {message && <Text color='red.500'>{message}</Text>}
            <Button bgColor={colors.primary} _hover={{ bgColor: colors.neutral }} textColor={colors.white} type='submit' w='100%'>
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
