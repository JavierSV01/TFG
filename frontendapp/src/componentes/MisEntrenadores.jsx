import React from 'react'
import { Box, Flex, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import colors from '../constantes/colores'
import useMisAsociaciones from '../hooks/useMisAsociaciones'

const MisEntrenadores = () => {
  const navigate = useNavigate()
  const entrenadores = useMisAsociaciones()

  return (
    <Flex gap={4} wrap='wrap' justify='space-between' width='100%'>
      {entrenadores.map((entrenador) => (
        <Box
          key={entrenador._id}
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
          boxSizing='border-box'
        >
          {entrenador.usuarioEntrenador}

          <Button
            mt={4}
            bgColor={colors.secondary} // Fondo de acento
            color={colors.white} // Texto oscuro
            _hover={{ bgColor: colors.primary, color: colors.neutral }} // Cambio de color al pasar el mouse
            onClick={() => navigate(`/entrenador/${entrenador.usuarioEntrenador}`)}
          >Ver
          </Button>
        </Box>
      ))}
    </Flex>
  )
}

export default MisEntrenadores
