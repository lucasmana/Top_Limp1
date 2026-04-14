import { useState, useEffect } from 'react'
import './login.css'

function Login(props) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Mostrar mensagem se vier do cadastro
  useEffect(() => {
    if (props.mensagemCadastro) {
      setMensagem(props.mensagemCadastro)
      // Limpar mensagem após 5 segundos
      const timer = setTimeout(() => {
        setMensagem('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [props.mensagemCadastro])

  async function handleSubmit(e) {
    e.preventDefault()
    setMensagem('')
    
    if (!email || !senha) {
      alert('Preencha todos os campos.')
      return
    }
    
    setEnviando(true)
    try {
      console.log('Fazendo login com:', { email })
      
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      
      console.log('Status da resposta:', res.status)
      
      const data = await res.json()
      console.log('Resposta do servidor:', data)
      
      if (data.ok) {
        setMensagem('Login realizado com sucesso!')
        setEmail('')
        setSenha('')
        
        // Verificar se é usuário administrativo para redirecionamento
        if (data.usuario.tipo === 'administrativo' && data.usuario.redirect) {
          // Salvar informações do usuário administrativo
          localStorage.setItem('userEmail', data.usuario.email)
          localStorage.setItem('userType', data.usuario.tipo)
          localStorage.setItem('userName', data.usuario.nome)
          
          // Redirecionar para o portal administrativo
          window.location.href = data.usuario.redirect
        } else {
          // Login normal
          props.onLoginSucesso?.()
        }
      } else {
        alert(data.mensagem || 'Erro ao fazer login.')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-page">
      {mensagem && (
        <div className="login-mensagem-externa">
          {mensagem}
        </div>
      )}
      <div className="login-box">
        <img
          src="/img/logo2.png"
          alt="Logo Top Limp"
          className="login-logo"
        />
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="E-mail"
            aria-label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            
          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            aria-label="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" className="login-button" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="login-cadastro">
            Não tem conta?{' '}
            <button
              type="button"
              className="login-link login-link-button"
              onClick={() => props.onIrParaCadastro?.()}
            >
              Faça seu cadastro
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login