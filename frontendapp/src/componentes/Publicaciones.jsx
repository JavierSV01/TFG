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
} from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'
import { ListaDePublicaciones } from './ListaDePublicaciones'
import { useFavoritos } from '../hooks/useFavoritos'
const POSTS_PER_PAGE = 3

export function Publicaciones () {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = useCallback(async (pageToFetch) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(ENDPOINTS.PUBLICACION.GETPUBLICACIONES, {
        params: {
          page: pageToFetch,
          limit: POSTS_PER_PAGE
        }
      })

      const data = response.data
      const newPosts = data.posts || data.data || []
      const apiHasMore = data.hasNextPage ?? (newPosts.length === POSTS_PER_PAGE)

      setPosts(prevPosts => [...prevPosts, ...newPosts])
      setHasMore(apiHasMore)

      if (newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false)
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
    fetchPosts(currentPage)
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

  return (
    <Box p={5} minH='100vh' mx='auto'>
      {error && (
        <Alert status='error' mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <ListaDePublicaciones publicaciones={posts} onGuardar={handleGuardar} favoritos={favoritos} />

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
