import { Text, Box, Button, Heading, Stack, Modal, ModalHeader, ModalFooter, ModalBody, ModalOverlay, ModalContent, useDisclosure, IconButton, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useDietsPlans } from '../hooks/useDietsPlans'
import { useState } from 'react'
import colors from '../constantes/colores'
import { DeleteIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'

export function MisDietasCreadas () {
  const { dietas, reload } = useDietsPlans()
  const navigate = useNavigate()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dietaAEliminar, setDietaAEliminar] = useState(null)

  const toast = useToast()

  const handleDeleteDieta = async () => {
    if (!dietaAEliminar) return

    try {
      axios.defaults.withCredentials = true
      await axios.delete(`${ENDPOINTS.USER.DELETEDIET}?titulo=${dietaAEliminar}`)
      reload()
      toast({
        title: 'Dieta borrada',
        description: 'La dieta fue borrada correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al borrar la dieta. ' + error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setDietaAEliminar(null)
      onClose() // Cierra el modal después de la acción
    }
  }

  const confirmarEliminacion = (dietTitle) => {
    setDietaAEliminar(dietTitle)
    onOpen() // Abre el modal
  }
  return (
    <Box>
      <Heading as='h1' mb={6}>
        Mis Dietas
      </Heading>
      <Stack spacing={6}>
        {dietas.map((dieta, index) => (
          <li key={index}>
            <h2>{dieta.title}
              <Button
                margin='2' bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                onClick={() => { navigate(`/modificarDieta/${dieta.title}`) }}
              >Modificar
              </Button>
              <IconButton
                icon={<DeleteIcon />}
                aria-label='Borrar'
                bgColor={colors.primary}
                textColor={colors.white}
                _hover={{ bgColor: colors.secondary }}
                ml={2}
                onClick={() => confirmarEliminacion(dieta.title)}
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
            <Button colorScheme='red' mr={3} onClick={handleDeleteDieta}>
              Sí, borrar
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
