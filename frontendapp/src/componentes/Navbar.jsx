import React from 'react'
import {
  ChakraProvider,
  Box,
  Flex,
  IconButton,
  Link,
  HStack,
  useDisclosure,
  Stack,
  Button
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Navbar () {
  const backendHost = process.env.REACT_APP_BACKEND_HOST
  const backendPort = process.env.REACT_APP_BACKEND_PORT
  const backendUrl = 'http://' + backendHost + ':' + backendPort
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate = useNavigate()

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      // Hacemos la petición al servidor para cerrar sesión
      await axios.get(backendUrl + '/logout', { withCredentials: true })

      // Redirigir a la página principal '/'
      navigate('/')
    } catch (error) {
      console.error('Error al hacer logout:', error)
    }
  }

  return (
    <ChakraProvider>
      <Box bg='blue.900' px={4}>
        <Flex h={16} alignItems='center' justifyContent='space-between'>
          <Box fontWeight='bold' color='white'>MiLogo</Box>

          {/* Menu para pantallas grandes */}
          <HStack as='nav' spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavigationMenu handleLogout={handleLogout} />
          </HStack>

          {/* Icono de hamburguesa para pantallas móviles */}
          <IconButton
            size='md'
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label='Open Menu'
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

        </Flex>
        {/* Menu de hamburguesa para pantallas pequeñas */}
        {isOpen
          ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as='nav' spacing={4}>
                <NavigationMenu handleLogout={handleLogout} />
              </Stack>
            </Box>
            )
          : null}
      </Box>
    </ChakraProvider>

  )
}

function NavLink ({ href, label }) {
  return (
    <Link
      href={href}
      px={2}
      py={1}
      rounded='md'
      _hover={{ bg: 'blue.700', color: 'white' }}
      _focus={{ boxShadow: 'outline' }}
      color='white'
      fontWeight='bold'
    >
      {label}
    </Link>
  )
}

const NavigationMenu = ({ handleLogout }) => {
  return (
    <>
      <NavLink href='/principal' label='Inicio' />
      <NavLink href='/crearEntrenamiento' label='Nuevo Entrenamiento' />
      <NavLink href='/services' label='Servicios' />
      <NavLink href='/contact' label='Contacto' />
      <NavLink href='/perfil' label='Mi perfil' />
      <Button onClick={handleLogout} colorScheme='red' variant='solid'>
        Logout
      </Button>
    </>
  )
}

export default Navbar
