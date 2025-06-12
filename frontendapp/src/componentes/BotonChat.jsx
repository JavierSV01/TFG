import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@chakra-ui/react'
import { ENDPOINTS } from '../constantes/endponits'
import colors from '../constantes/colores'

const BotonChat = ({ user1, user2 }) => {
  const [chatId, setChatId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChatData = async () => {
      if (user1 && user2) {
        try {
          axios.defaults.withCredentials = true
          const response = await axios.get(
            `${ENDPOINTS.CHAT.EXIST}?id1=${user1}&id2=${user2}`
          )
          setChatId(response.data.chat_id)
        } catch (error) {
          console.error('Error obteniendo el chat ID:', error)
        }
      }
    }

    fetchChatData()
  }, [user1, user2])

  return (
    <Button
      bgColor={colors.secondary}
      textColor={colors.white}
      _hover={{ bgColor: colors.primary, color: colors.neutral }}
      onClick={() => chatId && navigate(`/chat/${chatId}`)}
    >
      Chat personal
    </Button>
  )
}

export default BotonChat
