import { useState, useEffect } from 'react'
import './cadastro.css'

function Cadastro(props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Limpar mensagem automaticamente após 5 segundos
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [mensagem])

  async function handleSubmit(e) {
    e.preventDefault()
    setMensagem('')
    if (senha !== confirmarSenha) {
      setMensagem('As senhas não conferem.')
      return
    }
    setEnviando(true)
    try {
      console.log('Enviando dados:', { nome, email, cnpj })
      
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, cnpj, senha }),
      })
      
      console.log('Status da resposta:', res.status)
      
      const data = await res.json()
      console.log('Resposta do servidor:', data)
      
      if (data.ok) {
        // Redirecionar para login com mensagem de sucesso
        props.onIrParaLogin?.('Cadastro realizado com sucesso! Você já pode fazer login.')
        
        setNome('')
        setEmail('')
        setCnpj('')
        setSenha('')
        setConfirmarSenha('')
      } else {
        setMensagem(data.mensagem || 'Erro ao cadastrar.')
      }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      alert('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cadastro-page">
      {mensagem && (
        <div className="cadastro-mensagem-externa">
          {mensagem}
        </div>
      )}
      <div className="cadastro-box">
        <img
          src="/img/logo2.png"
          alt="Logo Top Limp"
          className="cadastro-logo"
        />
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <input
            className="cadastro-input"
            type="text"
            placeholder="Nome do Cliente ou empresa"
            aria-label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            className="cadastro-input"
            type="email"
            placeholder="E-mail"
            aria-label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="cadastro-input"
            type="text"
            inputMode="numeric"
            placeholder="Digite o CNPJ"
            aria-label="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
          />
          <input
            className="cadastro-input"
            type="password"
            placeholder="Senha"
            aria-label="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            className="cadastro-input"
            type="password"
            placeholder="Confirmar senha"
            aria-label="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          <button type="submit" className="cadastro-button" disabled={enviando}>
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <p className="cadastro-login">
            Já tem conta?{' '}
            <button
              type="button"
              className="cadastro-link cadastro-link-button"
              onClick={() => props.onIrParaLogin?.()}
            >
              Faça login
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Cadastro
