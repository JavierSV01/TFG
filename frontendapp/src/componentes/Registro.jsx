import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Box, Button, Input, FormControl, FormLabel, Heading, Stack, Text } from '@chakra-ui/react'

export function Registro () {
  // Usar refs para capturar valores de los campos
  const usernameRef = useRef('')
  const passwordRef = useRef('')
  const passwordRepeatRef = useRef('')
  const [message, setMessage] = useState('')

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const passwordRepeat = passwordRepeatRef.current.value
    const registerData = {
      usuario: username,
      contrasenia: password
    }

    if (password !== passwordRepeat) {
      setMessage('Las contraseñas no coinciden')
    } else {
      try {
        const response = await axios.post('http://localhost:3001/registro', registerData)
        setMessage(response.data.mensaje || 'Registro exitoso') // Muestra el mensaje del servidor o uno predeterminado
      } catch (error) {
        const serverMessage = error.response?.data?.mensaje || 'Ocurrió un error. Inténtalo de nuevo.'
        setMessage(serverMessage) // Muestra el mensaje del servidor o uno predeterminado
        console.error('Error:', error)
      }
    }
  }

  return (
    <Box w='100%' display='flex' justifyContent='center' alignItems='center'>
      <Box w='400px' p={8} bg='white' boxShadow='lg' borderRadius='md'>
        <Heading as='h2' size='lg' textAlign='center' mb={6}>
          Registro
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>

            <FormControl>
              <FormLabel htmlFor='username'>Nombre de usuario:</FormLabel>
              <Input ref={usernameRef} id='username' type='text' placeholder='Enter your username' />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='password'>Contraseña:</FormLabel>
              <Input ref={passwordRef} id='password' type='password' placeholder='Enter your password' />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='passwordRepeat'>Repite la contraseña:</FormLabel>
              <Input ref={passwordRepeatRef} id='passwordRepeat' type='password' placeholder='Enter your password one more time' />
            </FormControl>

            {message && <Text color='red.500'>{message}</Text>}
            <Button colorScheme='blue' type='submit' w='100%'>
              Registrarme
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
