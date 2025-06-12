import React, { useState, useEffect } from 'react'
import { useDisclosure, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, ChakraProvider, Box, useToast } from '@chakra-ui/react'
import { ListaDePublicaciones } from '../componentes/ListaDePublicaciones'
import axios from 'axios'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'
import { useAuthCheck } from '../hooks/useAuthCheck'
export const PaginaPostFavoritos = () => {
  const { authenticated, message } = useAuthCheck()

  const [favoritos, setFavoritos] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [publicacionAEliminar, setPublicacionAEliminar] = useState(null)

  const toast = useToast()

  useEffect(() => {
    fetchFavoritos()
  }, [])

  const fetchFavoritos = async () => {
    try {
      const response = await axios.get(ENDPOINTS.USER.GETFAVORITEPOSTS)
      setFavoritos(response.data.publicaciones)
    } catch (error) {
      console.error('Error al cargar favoritos', error)
    }
  }

  const handleToggleFavorito = async (postId) => {
    try {
      await axios.post(ENDPOINTS.USER.TOGGLEFAVORITEPOST, { postId })
      await fetchFavoritos() // Refrescamos después de eliminar
      onClose()
    } catch (error) {
      console.error('Error al modificar favorito', error)
    }
  }

  const handleClickEstrella = (postId) => {
    setPublicacionAEliminar(postId)
    onOpen()
  }

  const handleConfirmarEliminacion = () => {
    if (publicacionAEliminar) {
      handleToggleFavorito(publicacionAEliminar)
    }
  }

  const handleMeGusta = async (postId) => {
    try {
      await axios.post(ENDPOINTS.PUBLICACION.TOGGLELIKEDPOST, { postId })
      console.log('Me gusta dado correctamente')
      fetchFavoritos()
      // Más adelante actualizaremos el estado local para cambiar el botón
    } catch (err) {
      console.error('Error dando me gusta a la publicación:', err)
    }
  }

  const handleSend = async ({ comentario, publicacionId }) => {
    console.log(publicacionId, publicacionId)
    if (!comentario.trim()) {
      toast({
        title: 'Error',
        description: 'Agrega un texto al comentario.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }

    try {
      console.log(publicacionId, publicacionId)
      await axios.post(ENDPOINTS.PUBLICACION.POSTCOMENTARIO, {
        postId: publicacionId,
        comentario
      })

      toast({
        title: 'Comentario enviado',
        description: 'Tu comentario se ha enviado correctamente.',
        status: 'success',
        duration: 4000,
        isClosable: true
      })
      fetchFavoritos()
    } catch (error) {
      toast({
        title: 'Error al enviar',
        description: 'Hubo un problema al enviar tu comentario.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error(error)
    }
  }

  if (!authenticated) {
    return <div>{message}</div>
  }

  return (

    <ChakraProvider>

      <Box bg={colors.neutral} color={colors.white} p={6}>
        <Box bg={colors.secondary} borderRadius='md' p={6} width='100%' display='flex' flexDirection='column' alignItems='start' justifyContent='center'>
          <Heading as='h1' size='md' mb={2}>Publicaciones marcadas como favoritas
          </Heading>
          <Box p={5} minH='100vh' mx='auto'>
            <ListaDePublicaciones
              publicaciones={favoritos}
              favoritos={favoritos.map(p => p._id)}
              onGuardar={(postId) => handleClickEstrella(postId)}
              onComentar={handleSend}
              onLike={handleMeGusta}
            />
          </Box>

        </Box>

        {/* Modal de confirmación */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Eliminación</ModalHeader>
            <ModalBody>
              <Text>¿Estás seguro de que deseas eliminar esta publicación de tus favoritos?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={handleConfirmarEliminacion}>
                Sí, eliminar
              </Button>
              <Button variant='ghost' onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  )
}
