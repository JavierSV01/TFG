import { Box, Heading } from '@chakra-ui/react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js'
import colors from '../constantes/colores'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

export const Grafica = ({ dataLabels, data, chartLabel }) => {
  const chartData = {
    labels: dataLabels,
    datasets: [
      {
        label: chartLabel,
        data,
        borderColor: colors.primary,
        backgroundColor: colors.secondary,
        fill: true,
        tension: 0.2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: chartLabel // Usamos el chartLabel para el titulo
      }
    }
  }

  return (
    <Box bg={colors.neutral} borderRadius='md' p={6} width='100%' textAlign='center'>
      <Heading size='lg' mb={4}>{chartLabel}</Heading> {/* Usamos el chartLabel para el Heading */}
      <Line data={chartData} options={chartOptions} />
    </Box>
  )
}
