import { React, useState, useEffect } from 'react'
import Navbar from './Navbar'
import { useAuthCheck } from '../hooks/useAuthCheck'
import { ChakraProvider, Box, Flex, Heading, Center, Spinner, Container, SimpleGrid, Text, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'

const backendHost = process.env.REACT_APP_BACKEND_HOST
const backendPort = process.env.REACT_APP_BACKEND_PORT
const backendUrl = 'http://' + backendHost + ':' + backendPort

const Card = ({ key, nombre, presentacion }) => {
  const toast = useToast() // Utilizamos el Toast de Chakra UI para mostrar notificaciones

  // Función para manejar la solicitud
  const handleSolicitud = async (usuarioEntrenador) => {
    try {
      // Realizamos la solicitud POST al backend
      const response = await axios.post(backendUrl + '/api/solicitudes', {
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
    <Box borderWidth='1px' borderRadius='lg' p={4} boxShadow='md' background='white' color='black'>
      <Heading as='h3' size='md' mb={2}>
        {nombre}
      </Heading>
      <Text>{presentacion || 'Entrenador sin presentación'}</Text>
      <Button
        mt={4}
        colorScheme='teal'
        onClick={() => handleSolicitud(nombre)}
        loadingText='Enviando'
      >
        Solicitar Asesoramiento
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
        const response = await axios.get(backendUrl + '/api/usuarios/entrenadores')
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
    <Container maxW='container.xl' py={6}>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {data.map((item) => (
          <Card key={item._id.$oid} nombre={item.usuario} presentacion={item.presentacion} />
        ))}

      </SimpleGrid>
    </Container>
  )
}

export function PaginaPrincipal () {
  const { authenticated, message } = useAuthCheck()

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (
    <ChakraProvider>
      <Navbar />
      <Box bg='blue.500' color='white' minH='100vh' p={6}>

        <Flex direction='column' gap={6}>
          {/* Sección de entrenadores */}

          <Box bg='blue.800' borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
            <Heading as='h1' size='md' mb={2}>Entrenadores</Heading>
            <CardList />
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  )
}
