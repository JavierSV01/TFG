import { Box, SimpleGrid, useBreakpointValue } from '@chakra-ui/react'
import { useRef, useEffect, useState } from 'react'
import { Grafica } from './Grafica'

const GraficasAtributos = ({ atributos }) => {
  const minChildWidth = useBreakpointValue({ base: '100%', sm: '100%', md: '100%', lg: '33%' })
  const [boxWidth, setBoxWidth] = useState(0)
  const boxRef = useRef(null)

  useEffect(() => {
    if (boxRef.current) {
      setBoxWidth(boxRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (boxRef.current) {
        setBoxWidth(boxRef.current.offsetWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <SimpleGrid minChildWidth={minChildWidth} spacing={8}>
      {atributos.map((atributo, index) => {
        const dataLabels = atributo.historial.map((item) => item.fecha)
        const data = atributo.historial.map((item) => item.valor)
        return (
          <Box key={index} ref={boxRef} width='100%'>
            <Grafica chartLabel={atributo.nombre} dataLabels={dataLabels} data={data} width={boxWidth} />
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export default GraficasAtributos
