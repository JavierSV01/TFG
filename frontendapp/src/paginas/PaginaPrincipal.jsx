import { React, useState, useEffect } from 'react'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Flex, Heading, Center, Spinner, Container, SimpleGrid, Text, Button, useToast, HStack } from '@chakra-ui/react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'
import { useNavigate } from 'react-router-dom'
import { Publicaciones } from '../componentes/Publicaciones'
import FotoDePerfil from '../componentes/FotoDePerfil'

const Card = ({ key, nombre, presentacion }) => {
  const toast = useToast() // Utilizamos el Toast de Chakra UI para mostrar notificaciones

  // Función para manejar la solicitud
  const handleSolicitud = async (usuarioEntrenador) => {
    try {
      // Realizamos la solicitud POST al backend
      const response = await axios.post(ENDPOINTS.SOLICITUDE.APPLY, {
        usuarioEntrenador, // Aquí puedes pasar cualquier dato que necesites para registrar la solicitud
        mensaje: 'Solicito asesoramiento'
      })

      // Si la solicitud fue exitosa, mostrar un mensaje de éxito
      toast({
        description: response.data.mensaje || 'Solicitud enviada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      // Si hubo un error, mostrar un mensaje de error
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar la solicitud. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Box
      borderWidth='1px'
      borderRadius='lg'
      p={4}
      boxShadow='md'
      background={colors.neutral}
      color={colors.primary}
      display='flex'
      flexDirection='column'
      height='100%'
    >
      <Box flexGrow={1}>
        <HStack spacing={4}>
          <Box width={{ base: '60px', md: '80px' }} flexShrink={0}>
            <FotoDePerfil username={nombre} />
          </Box>
          <Heading as='h3' size='md'>
            {nombre}
          </Heading>
        </HStack>
      </Box>

      <Button
        mt={4}
        color={colors.white}
        bg={colors.secondary}
        onClick={() => handleSolicitud(nombre)}
        loadingText='Enviando'
        width='100%'
        _hover={{ bgColor: colors.primary, color: colors.neutral }}
        size={{ base: 'sm', md: 'md' }}
        flexShrink={0}
      >
        Solicitar
      </Button>
    </Box>
  )
}

const CardList = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(ENDPOINTS.USER.TRAINERS)
        setData(response.data)
      } catch (err) {
        setError('Error al obtener los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' />
      </Center>
    )
  }

  if (error) {
    return (
      <Center h='100vh'>
        <Text color='red.500'>{error}</Text>
      </Center>
    )
  }

  return (
    <Container maxW='container.3xl' py={6}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {data.map((item) => (
          <Card key={item._id.$oid} nombre={item.usuario} presentacion={item.presentacion} />
        ))}

      </SimpleGrid>
    </Container>
  )
}

export function PaginaPrincipal () {
  const { authenticated, message } = useAuthCheck()

  const navigate = useNavigate()

  const handleClick = () => {
    const rutaDestino = '/publicar'
    navigate(rutaDestino)
  }

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ChakraProvider>
      <Box bg={colors.neutral} color={colors.white} minH='100vh' p={6}>

        <Flex direction='column' gap={6}>
          {/* Sección de entrenadores */}

          <Box bg={colors.secondary} borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading as='h1' size='md' mb={2}>Entrenadores</Heading>
            <CardList />
          </Box>
          <Box bg={colors.secondary} borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
            <Heading as='h1' size='md' mb={2}>Publicaciones</Heading>
            <Publicaciones />
          </Box>
        </Flex>

        <Box
          position='fixed'
          bottom='10'
          right='10'
          zIndex='sticky'
        >
          <Button size='lg' colorScheme='teal' onClick={handleClick}>
            Publicar
          </Button>
        </Box>
      </Box>
    </ChakraProvider>
  )
}
