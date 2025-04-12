import { Grid, GridItem, Text, useMediaQuery } from '@chakra-ui/react'
import ImageLoader from './ImageLoader'

export const ImageEvolutionView = ({ imagenes }) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 768px)')
  const [isLargerThanLg] = useMediaQuery('(min-width: 992px)')

  // Define el número de columnas basado en el tamaño de la pantalla
  const columns = isLargerThanLg ? 3 : isLargerThanMd ? 2 : 1

  if (!imagenes) {
    return <Text> Sin imagenes </Text>
  }
  return (
    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={4}>
      {imagenes.map((imagen) => (
        <GridItem key={imagen.fileId}>
          <ImageLoader imageId={imagen.fileId} />
          <Text fontSize='sm' color='gray.500'>
            {imagen.fecha}
          </Text>
        </GridItem>
      ))}
    </Grid>
  )
}
