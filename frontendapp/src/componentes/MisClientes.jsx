import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { SimpleGrid, Box, Button, Heading } from '@chakra-ui/react'
import colors from '../constantes/colores'

const MisClientes = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(ENDPOINTS.USER.CLIENTS)
        setClientes(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return (

    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
      {clientes.map((cliente) => (
        <Box
          key={cliente._id}
          borderWidth='1px'
          borderRadius='md'
          p={4}
          boxShadow='md'
          background={colors.neutral} // Fondo principal
          color='black' // Texto blanco
          borderColor='white' // Borde blanco
          display='flex' // Usamos flexbox para alinear el contenido
          flexDirection='column' // Aseguramos que el contenido se apile en columna
          justifyContent='center' // Centrado vertical
          alignItems='center' // Centrado horizontal
          textAlign='center' // Aseguramos que el texto esté centrado
          height='100%'
        >
          <Heading as='h3' size='md' mb={2}>
            {cliente}
          </Heading>

          <Button
            mt={4}
            bgColor={colors.accent} // Fondo de acento
            color={colors.dark} // Texto oscuro
            _hover={{ bgColor: colors.primary, color: colors.neutral }} // Cambio de color al pasar el mouse
          >
            Ver
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default MisClientes
