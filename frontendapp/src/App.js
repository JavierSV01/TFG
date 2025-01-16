import { PaginaLogin } from './paginas/PaginaLogin'
import { PaginaPrincipal } from './paginas/PaginaPrincipal'
import { PaginaCreacionEntrenamiento } from './paginas/PaginaCreacionEntrenamiento'
import { PaginaMiPerfil } from './paginas/PaginaMiPerfil'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PaginaCliente } from './paginas/PaginaCliente'
import { PaginaMiEntrenador } from './paginas/PaginaMiEntrenador'
import { PaginaMiEntrenamiento } from './paginas/PaginaMiEntrenamiento'
import { PaginaDiaEntrenamiento } from './paginas/PaginaDiaEntrenamieto'
import PaginaUnChat from './paginas/PaginaUnChat'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<PaginaLogin />} />
        <Route path='/principal' element={<PaginaPrincipal />} />
        <Route path='/crearEntrenamiento' element={<PaginaCreacionEntrenamiento />} />
        <Route path='/perfil' element={<PaginaMiPerfil />} />
        <Route path='/cliente/:usuario' element={<PaginaCliente />} />
        <Route path='/entrenador/:entrenador' element={<PaginaMiEntrenador />} />
        <Route path='/entrenador/:entrenador/:idEntrenamiento' element={<PaginaMiEntrenamiento />} />
        <Route path='/entrenador/:entrenador/:idEntrenamiento/:semIndex/:dayIndex' element={<PaginaDiaEntrenamiento />} />
        <Route path='/chat/:id1/:id2' element={<PaginaUnChat />} />
      </Routes>
    </Router>
  )
}

export default App
