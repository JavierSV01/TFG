import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import { SimpleGrid, Box, Button, Heading } from '@chakra-ui/react'
import colors from '../constantes/colores'
import { useNavigate } from 'react-router-dom'

const MisClientes = ({ triggerRecarga }) => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
  useEffect(() => {
    fetchClientes()
  }, [triggerRecarga])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return (

    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
      {clientes.map((cliente, index) => (
        <Box
          key={index}
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
            {cliente}
          </Heading>

          <Button
            mt={4}
            bgColor={colors.secondary} // Fondo de acento
            color={colors.white} // Texto oscuro
            _hover={{ bgColor: colors.primary, color: colors.neutral }} // Cambio de color al pasar el mouse
            onClick={() => navigate(`/cliente/${cliente}`)}
          >
            Ver
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default MisClientes
