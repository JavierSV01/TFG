import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Box, Button, Input, FormControl, FormLabel, Heading, Stack, Text, Radio, RadioGroup } from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'

export function Registro () {
  // Usar refs para capturar valores de los campos
  const usernameRef = useRef('')
  const passwordRef = useRef('')
  const passwordRepeatRef = useRef('')
  const [role, setRole] = useState('entrenador') // Opción predeterminada
  const handleRoleChange = (value) => {
    setRole(value)
  }
  const [message, setMessage] = useState('')

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = usernameRef.current.value
    const password = passwordRef.current.value
    const passwordRepeat = passwordRepeatRef.current.value
    const registerData = {
      usuario: username,
      contrasenia: password,
      rol: role
    }

    if (password !== passwordRepeat) {
      setMessage('Las contraseñas no coinciden')
    } else {
      try {
        const response = await axios.post(ENDPOINTS.USER.REGISTER, registerData)
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

            <Text fontSize='xl' mb={4}>Selecciona tu rol:</Text>
            <RadioGroup onChange={handleRoleChange} value={role}>
              <Stack direction='row' spacing={4}>
                <Radio value='entrenador' colorScheme='blackAlpha'>
                  Entrenador
                </Radio>
                <Radio value='cliente' colorScheme='blackAlpha'>
                  Cliente
                </Radio>
              </Stack>
            </RadioGroup>

            {message && <Text color='red.500'>{message}</Text>}
            <Button bgColor={colors.primary} _hover={{ bgColor: colors.neutral }} textColor={colors.white} type='submit' w='100%'>
              Registrarme como {role === 'entrenador' ? 'Entrenador' : 'Cliente'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  )
}
