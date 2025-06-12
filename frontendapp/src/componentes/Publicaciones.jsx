// Publicaciones.js
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  Box,
  Center,
  Spinner,
  Button,
  Alert,
  AlertIcon,
  Text
  , useToast
} from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'
import { ListaDePublicaciones } from './ListaDePublicaciones'
import { useFavoritos } from '../hooks/useFavoritos'
const POSTS_PER_PAGE = 2

export function Publicaciones () {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  const toast = useToast()

  const fetchPosts = useCallback(async (pageToFetch, pagePerPage, recargaComentarios) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(ENDPOINTS.PUBLICACION.GETPUBLICACIONES, {
        params: {
          page: pageToFetch,
          limit: pagePerPage
        }
      })

      const data = response.data
      const newPosts = data.posts || data.data || []

      if (recargaComentarios) {
        setPosts(newPosts)
      } else {
        const apiHasMore = data.hasNextPage ?? (newPosts.length === pagePerPage)
        setPosts(prevPosts => [...prevPosts, ...newPosts])
        setHasMore(apiHasMore)

        if (newPosts.length < pagePerPage) {
          setHasMore(false)
        }
      }
    } catch (err) {
      console.error('Error fetching posts with axios:', err)
      const errorMessage =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'No se pudo conectar al API'
      setError(`Error: ${errorMessage}`)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(currentPage, POSTS_PER_PAGE, false)
  }, [currentPage, fetchPosts])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const { favoritos, fetchFavoritos } = useFavoritos()

  useEffect(() => {
    fetchFavoritos()
  }, [fetchFavoritos])

  // Función para guardar publicación como favorita
  const handleGuardar = async (postId) => {
    try {
      await axios.post(ENDPOINTS.USER.TOGGLEFAVORITEPOST, { postId })
      await fetchFavoritos()
      console.log('Publicación guardada correctamente')
      // Más adelante actualizaremos el estado local para cambiar el botón
    } catch (err) {
      console.error('Error guardando publicación:', err)
    }
  }

  const handleMeGusta = async (postId) => {
    try {
      await axios.post(ENDPOINTS.PUBLICACION.TOGGLELIKEDPOST, { postId })
      console.log('Me gusta dado correctamente')
      fetchPosts(1, currentPage * POSTS_PER_PAGE, true)
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
      fetchPosts(1, currentPage * POSTS_PER_PAGE, true)
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

  return (
    <Box p={5} minH='100vh' mx='auto'>
      {error && (
        <Alert status='error' mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <ListaDePublicaciones publicaciones={posts} onComentar={handleSend} onGuardar={handleGuardar} onLike={handleMeGusta} favoritos={favoritos} />

      {loading && (
        <Center mt={4}>
          <Spinner size='xl' />
        </Center>
      )}

      {!loading && hasMore && (
        <Center mt={6}>
          <Button onClick={handleLoadMore} isLoading={loading} colorScheme='teal'>
            Cargar más
          </Button>
        </Center>
      )}

      {!loading && !hasMore && posts.length > 0 && (
        <Center mt={6}>
          <Text color='gray.500'>No hay más publicaciones para mostrar.</Text>
        </Center>
      )}

      {!loading && posts.length === 0 && !error && (
        <Center mt={6}>
          <Text color='gray.500'>No se encontraron publicaciones.</Text>
        </Center>
      )}
    </Box>
  )
}
