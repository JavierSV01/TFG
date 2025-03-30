import { Box, Button, Heading, Stack, IconButton, useDisclosure, useToast, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalFooter, Text } from '@chakra-ui/react'
import { usePlantillasEntrenamiento } from '../hooks/usePlantillasEntrenamiento'
import { useNavigate } from 'react-router-dom'
import colors from '../constantes/colores'
import { DeleteIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

function MisPlantillasEntrenamiento () {
  const { plantillas, reload } = usePlantillasEntrenamiento()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [entrenamientoAEliminar, setEntrenamientoAEliminar] = useState(null)

  const confirmarEliminacion = (workoutTitle) => {
    setEntrenamientoAEliminar(workoutTitle)
    onOpen() // Abre el modal
  }

  const toast = useToast()

  const handleDeleteEntrenamiento = async () => {
    if (!entrenamientoAEliminar) return

    try {
      axios.defaults.withCredentials = true
      await axios.delete(`${ENDPOINTS.USER.DELETEWORKOUT}?titulo=${entrenamientoAEliminar}`)
      reload()
      toast({
        title: 'Entrenamiento borrado',
        description: 'El entrenamiento fue borrado correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al borrar el entrenamiento. ' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setEntrenamientoAEliminar(null)
      onClose() // Cierra el modal después de la acción
    }
  }

  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Plantillas de Entrenamiento
      </Heading>
      <Stack spacing={6}>
        {plantillas.map((plantilla, index) => (
          <li key={index}>
            <h2>{plantilla.title}
              <Button
                margin='2' bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                onClick={() => { navigate(`/modificarEntrenamiento/${plantilla.title}`) }}
              >Modificar
              </Button>
              <IconButton
                icon={<DeleteIcon />}
                aria-label='Borrar'
                bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                ml={2}
                onClick={() => confirmarEliminacion(plantilla.title)}
              />
            </h2>

          </li>
        ))}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar este entrenamiento?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={handleDeleteEntrenamiento}>
              Sí, borrar
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MisPlantillasEntrenamiento
