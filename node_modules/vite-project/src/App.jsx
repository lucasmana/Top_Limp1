import { useState } from 'react'
import './App.css'
import Login from './components/login/login'
import Cadastro from './components/cadastro/cadastro'
import Home from './components/home/home'
import PortalRouter from './components/portaladm/PortalRouter'

function App() {
  const [tela, setTela] = useState('login')
  const [logado, setLogado] = useState(false)
  const [mensagemCadastro, setMensagemCadastro] = useState('')

  // Verificar se está na rota do portal administrativo
  const isPortalAdm = window.location.pathname === '/portaladm'
  
  if (isPortalAdm) {
    return <PortalRouter />
  }

  if (logado) {
    return <Home />
  }

  return (
    <>
      {tela === 'login' ? (
        <Login
          mensagemCadastro={mensagemCadastro}
          onIrParaCadastro={() => {
            setMensagemCadastro('')
            setTela('cadastro')
          }}
          onLoginSucesso={() => setLogado(true)}
        />
      ) : (
        <Cadastro 
          onIrParaLogin={(mensagem) => {
            setMensagemCadastro(mensagem || '')
            setTela('login')
          }} 
        />
      )}
    </>
  )
}

export default App
