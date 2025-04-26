const backendHost = process.env.REACT_APP_BACKEND_HOST
const backendPort = process.env.REACT_APP_BACKEND_PORT
const BASE_URL = 'http://' + backendHost + ':' + backendPort

export const ENDPOINTS = {
  USER: {
    LOGIN: `${BASE_URL}/user/login`,
    LOGOUT: `${BASE_URL}/user/logout`,
    REGISTER: `${BASE_URL}/user/register`,
    STATUS: `${BASE_URL}/user/status`,
    ROL: `${BASE_URL}/user/role`,
    TRAINERS: `${BASE_URL}/user/trainers`,
    WORKOUT: `${BASE_URL}/user/workout`,
    WORKOUTS: `${BASE_URL}/user/workouts`,
    CLIENTS: `${BASE_URL}/user/clients`,
    INFO: `${BASE_URL}/user/allinfo`,
    NAME: `${BASE_URL}/user/username`,
    UPDATE_DATA: `${BASE_URL}/user/data`,
    CLIENT_INFO: `${BASE_URL}/user/clientinfo`,
    UPDATE_ATTR: `${BASE_URL}/user/attrdinamico`,
    DIET: `${BASE_URL}/user/diet`,
    DIETS: `${BASE_URL}/user/diets`,
    MODIFYWORKOUT: `${BASE_URL}/user/modworkout`,
    MODIFYDIET: `${BASE_URL}/user/moddiet`,
    DELETEWORKOUT: `${BASE_URL}/user/delworkout`,
    DELETEDIET: `${BASE_URL}/user/deldiet`,
    POSTPROFILEIMAGE: `${BASE_URL}/user/profileimage`,
    GETPROFILEIMAGE: `${BASE_URL}/user/profileimage`,
    POSTEVOLUCIONFISICA: `${BASE_URL}/user/evolutionimage`,
    GETEVOLUTIONFISICA: `${BASE_URL}/user/evolutionimage`,
    TOGGLEFAVORITEPOST: `${BASE_URL}/user/togglefavoritepost`,
    GETFAVORITEPOSTSIDS: `${BASE_URL}/user/getfavoriteposts`,
    GETFAVORITEPOSTS: `${BASE_URL}/user/getfavoritepublications`
  },
  SOLICITUDE: {
    MYSOLICITUDE: `${BASE_URL}/sol/mysolicitude`,
    APPLY: `${BASE_URL}/sol/apply`,
    ACCEPT: `${BASE_URL}/sol/accept`
  },
  ASSOCIATION: {
    ADDWORKOUT: `${BASE_URL}/ass/addworkout`,
    GETASSOCITIONSBYUSER: `${BASE_URL}/ass/myassociations`,
    REMOVEWORKOUT: `${BASE_URL}/ass/removeworkout`,
    UPDATEWORKOUT: `${BASE_URL}/ass/updateworkout`,
    PUTDIET: `${BASE_URL}/ass/putdiet`
  },
  CHAT: {
    EXIST: `${BASE_URL}/chat/exist`, // Necesita /id1, /id2
    GETCHATBYID: `${BASE_URL}/chat/getchat`, // Necesita chat_id
    GETCHATS: `${BASE_URL}/chat/getchats`
  },
  IMAGE: {
    GETIMAGE: `${BASE_URL}/image/img` // Necesita /id
  },
  PUBLICACION: {
    POSTPUBLICACION1: `${BASE_URL}/publicpost/publish`,
    GETPUBLICACIONES: `${BASE_URL}/publicpost/posts`
  }
}
