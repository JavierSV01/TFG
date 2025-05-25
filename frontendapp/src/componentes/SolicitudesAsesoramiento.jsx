import React, { useState, useEffect } from 'react'
import { Box, Heading, Text, SimpleGrid, useToast, Button } from '@chakra-ui/react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'

// Componente principal que obtiene las sol
const SolicitudesAsesoramiento = ({ onSolicitudAceptada }) => {
  const [solicitudes, setSolicitudes] = useState([])
  const toast = useToast()

  // Función para obtener las notificaciones desde el backend
  const obtenerSolicitudes = async () => {
    try {
      const response = await axios.get(ENDPOINTS.SOLICITUDE.MYSOLICITUDE)

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

  // Función para manejar la aceptación de asesoramiento
  const handleAceptarAsesoramiento = async (usuarioCliente, usuarioEntrenador) => {
    try {
      const response = await axios.post(ENDPOINTS.SOLICITUDE.ACCEPT, {
        usuarioCliente,
        usuarioEntrenador
      })

      if (response.status === 201) {
        obtenerSolicitudes()
        if (onSolicitudAceptada) {
          onSolicitudAceptada()
        }
        toast({
          title: 'Asesoramiento aceptado',
          description: 'Se ha creado la asociación correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: 'Asesoramiento aceptado anteriormente',
          description: response.data.error,
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

  // Obtener las notificaciones cuando el componente se monte
  useEffect(() => {
    obtenerSolicitudes()
  }, []) // Solo se ejecuta cuando el usuarioId cambia
  if (solOrdenadas.length === 0) {
    return (
      <Box textAlign='center' mt={8}>
        <Heading as='h2' size='md' mb={4}>
          No hay solicitudes de asesoramiento
        </Heading>
        <Text>¡Vuelve más tarde para ver si tienes nuevas solicitudes!</Text>
      </Box>
    )
  } else {
    return (
    // <ListaSolAsesoramientos solicitudes={solicitudes} setSolicitudes={setSolicitudes} />

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {solOrdenadas.map((sol) => (
          <Box
            key={sol._id}
            borderWidth='1px'
            borderRadius='md'
            p={4}
            boxShadow='md'
            background={colors.neutral}
            color='black'
            borderColor='white'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            textAlign='center'
            height='100%'
          >
            <Heading as='h3' size='md' mb={2}>
              {sol.usuarioCliente}
            </Heading>
            <Text mt={2}>Mensaje: {sol.mensaje}</Text>
            <Text>Fecha: {new Date(sol.fecha).toLocaleString()}</Text>
            <Button
              mt={4}
              _hover={{ bgColor: colors.primary, color: colors.neutral }}
              color={colors.white}
              bg={colors.secondary}
              onClick={() =>
                handleAceptarAsesoramiento(sol.usuarioCliente, sol.usuarioEntrenador)}
            >
              Aceptar Asesoramiento
            </Button>
          </Box>
        ))}
      </SimpleGrid>

    )
  }
}

export default SolicitudesAsesoramiento
