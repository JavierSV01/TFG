import React, { useState, useEffect } from 'react'
import { Box, Heading, Text, SimpleGrid, useToast, Button } from '@chakra-ui/react'
import axios from 'axios'

const backendHost = process.env.REACT_APP_BACKEND_HOST
const backendPort = process.env.REACT_APP_BACKEND_PORT
const backendUrl = 'http://' + backendHost + ':' + backendPort

// Componente para mostrar una lista de solicitudes de asesoramiento

const ListaSolAsesoramientos = ({ solicitudes }) => {
  const toast = useToast()

  // Función para manejar la aceptación de asesoramiento
  const handleAceptarAsesoramiento = async (usuarioCliente, usuarioEntrenador) => {
    try {
      const response = await axios.post(backendUrl + '/api/aceptar_asesoramiento', {
        usuarioCliente,
        usuarioEntrenador
      })

      if (response.status === 201) {
        toast({
          title: 'Asesoramiento aceptado',
          description: 'Se ha creado la asociación correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: 'Error al aceptar el asesoramiento',
          description: response.error,
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al aceptar el asesoramiento.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  const solOrdenadas = solicitudes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
      {solOrdenadas.map((sol) => (
        <Box
          key={sol._id}
          borderWidth='1px'
          borderRadius='md'
          p={4}
          boxShadow='md'
          background='white'
          color='black' // Texto blanco
          borderColor='white' // Borde blanco
          display='flex' // Usamos flexbox para alinear el contenido
          flexDirection='column' // Aseguramos que el contenido se apile en columna
          justifyContent='center' // Centrado vertical
          alignItems='center' // Centrado horizontal
          textAlign='center' // Aseguramos que el texto esté centrado
          height='100%' // Para asegurar que el Box tenga una altura suficiente para centrar el contenido
        >
          <Heading as='h3' size='md' mb={2}>
            {sol.usuarioCliente}
          </Heading>
          <Text mt={2}>Mensaje: {sol.mensaje}</Text>
          <Text>Fecha: {new Date(sol.fecha).toLocaleString()}</Text>
          <Button
            mt={4}
            colorScheme='teal'
            onClick={() => handleAceptarAsesoramiento(sol.usuarioCliente, sol.usuarioEntrenador)}
          >
            Aceptar Asesoramiento
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  )
}

// Componente principal que obtiene las sol
const SolicitudesAsesoramiento = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const toast = useToast()

  // Función para obtener las notificaciones desde el backend
  const obtenerSolicitudes = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/notificaciones')
      setSolicitudes(response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al cargar las notificaciones.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  // Obtener las notificaciones cuando el componente se monte
  useEffect(() => {
    obtenerSolicitudes()
  }, []) // Solo se ejecuta cuando el usuarioId cambia

  return (
    <ListaSolAsesoramientos solicitudes={solicitudes} />
  )
}

export default SolicitudesAsesoramiento
