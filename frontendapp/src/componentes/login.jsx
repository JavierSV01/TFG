import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Box, Button, Input, FormControl, FormLabel, Heading, Stack, Text } from '@chakra-ui/react'

export function Login () {
  // Usar refs para capturar valores de los campos
  const usernameRef = useRef('')
  const passwordRef = useRef('')
  const [message, setMessage] = useState('')

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const loginData = {
      username,
      password
    }

    try {
      const response = await axios.post('http://localhost:3001/login', loginData)

      // Aquí verificamos que la respuesta sea 200 y válida
      if (response.status === 200 && response.data.valid) {
        setMessage('Inicio de sesión exitoso')
        // Aquí puedes redirigir al usuario si es necesario
      } else {
        setMessage('Usuario o contraseña incorrectos')
      }
    } catch (error) {
      // Manejar errores específicos
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        if (error.response.status === 401) {
          setMessage('Usuario o contraseña incorrectos')
        } else {
          setMessage('Ocurrió un error. Inténtalo de nuevo.')
        }
      } else {
        // No se recibió respuesta del servidor
        setMessage('Ocurrió un error. Inténtalo de nuevo.')
      }
      console.error('Error:', error)
    }
  }
  return (
    <Box w='100%' h='100vh' display='flex' justifyContent='center' alignItems='center' bg='gray.100'>
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
            <Button colorScheme='blue' type='submit' w='100%'>
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
