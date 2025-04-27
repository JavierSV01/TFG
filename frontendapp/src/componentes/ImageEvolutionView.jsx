import { Box, Text } from '@chakra-ui/react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import ImageLoader from './ImageLoader'

// Plugin para thumbnails
function ThumbnailPlugin (mainRef) {
  return (slider) => {
    function removeActive () {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active')
      })
    }
    function addActive (idx) {
      slider.slides[idx].classList.add('active')
    }

    function addClickEvents () {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx)
        })
      })
    }

    slider.on('created', () => {
      if (!mainRef.current) return
      addActive(slider.track.details.rel)
      addClickEvents()
      mainRef.current.on('animationStarted', (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

export const ImageEvolutionView = ({ imagenes }) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0
  })

  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: 5,
        spacing: 10
      }
    },
    [ThumbnailPlugin(instanceRef)]
  )

  if (!imagenes || imagenes.length === 0) {
    return <Text>Sin imágenes</Text>
  }

  return (
    <Box width='100%' display='flex' flexDirection='column' alignItems='center' gap={4}>
      {/* Slider principal */}
      <Box
        ref={sliderRef}
        className='keen-slider'
        width='100%'
        maxW='1000px' /* <- Aquí limitamos el ancho máximo */
        overflow='hidden'
        borderRadius='md'
        position='relative'
      >
        {imagenes.map((imagen) => (
          <Box
            key={imagen.fileId}
            className='keen-slider__slide'
            width='100%' /* <- Forzamos cada slide a ocupar su contenedor */
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            p={2}
          >
            <ImageLoader
              imageId={imagen.fileId}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
            <Text fontSize='sm' color='gray.500' mt={2}>
              {imagen.fecha}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Thumbnails */}
      <Box
        ref={thumbnailRef}
        className='keen-slider'
        width='100%'
        maxW='1000px' /* <- También limitamos el ancho de miniaturas */
        overflow='hidden'
        borderRadius='md'
      >
        {imagenes.map((imagen) => (
          <Box
            key={imagen.fileId}
            className='keen-slider__slide'
            cursor='pointer'
            overflow='hidden'
            borderRadius='md'
            border='2px solid transparent'
            _hover={{ borderColor: 'blue.300' }}
          >
            <ImageLoader
              imageId={imagen.fileId}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
