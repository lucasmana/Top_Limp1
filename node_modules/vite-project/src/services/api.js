// Configuração da API
const API_BASE_URL = 'http://localhost:3001/api';

// Cliente API
export const clientesAPI = {
  // Listar todos os clientes
  listar: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      if (!response.ok) throw new Error('Erro ao listar clientes');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar cliente');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  // Criar novo cliente
  criar: async (clienteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar cliente');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  // Atualizar cliente
  atualizar: async (id, clienteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar cliente');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  // Deletar cliente
  deletar: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erro ao deletar cliente');
      return await response.json();
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },
};

// Teste de conexão
export const testarConexao = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    throw error;
  }
};
