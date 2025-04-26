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
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'
import { useUserRole } from '../context/useUserRole'
function Navbar () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const userRol = useUserRole()
  const navigate = useNavigate()

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      // Hacemos la petición al servidor para cerrar sesión
      await axios.post(ENDPOINTS.USER.LOGOUT, { withCredentials: true })
      userRol.setLogueado(false)
      navigate('/')
    } catch (error) {
      console.error('Error al hacer logout:', error)
    }
  }

  return (
    <ChakraProvider>
      <Box bg={colors.primary} px={3}>
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
  const navigate = useNavigate()
  return (
    <Link
      onClick={() => navigate(href)}
      px={2}
      py={1}
      rounded='md'
      _hover={{ bg: colors.secondary, color: colors.white }}
      _focus={{ boxShadow: 'outline' }}
      color='white'
      fontWeight='bold'
    >
      {label}
    </Link>
  )
}

const NavigationMenu = ({ handleLogout }) => {
  const { role } = useUserRole()
  return (
    <>
      <NavLink href='/principal' label='Inicio' />
      {role === 'entrenador' && <NavLink href='/crearEntrenamiento' label='Nuevo Entrenamiento' />}
      {role === 'entrenador' && <NavLink href='/crearDieta' label='Nueva Dieta' />}
      <NavLink href='/chats' label='Mis Chats' />
      <NavLink href='/postfavoritos' label='Post Favoritos' />
      <NavLink href='/perfil' label='Mi Perfil' />
      <Button onClick={handleLogout} bg={colors.accent} variant='solid' color={colors.white} _hover={{ bg: colors.neutral }}>
        Logout
      </Button>
    </>
  )
}

export default Navbar
