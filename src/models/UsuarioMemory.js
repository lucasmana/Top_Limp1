// Modelo temporário em memória para teste (sem MongoDB)
let usuarios = [];
let nextId = 1;

class UsuarioMemory {
  static async create(userData) {
    const usuario = {
      _id: nextId++,
      ...userData,
      createdAt: new Date()
    };
    
    usuarios.push(usuario);
    console.log('Usuário salvo em memória:', usuario);
    return usuario;
  }
  
  static async findOne(query) {
    if (query.email) {
      return usuarios.find(u => u.email === query.email);
    }
    if (query.cnpj) {
      return usuarios.find(u => u.cnpj === query.cnpj);
    }
    if (query.$or) {
      return usuarios.find(u => 
        query.$or.some(condition => {
          if (condition.email) return u.email === condition.email;
          if (condition.cnpj) return u.cnpj === condition.cnpj;
          return false;
        })
      );
    }
    return null;
  }
  
  static async find() {
    return usuarios;
  }
}

module.exports = UsuarioMemory;
