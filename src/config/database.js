const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Conectar ao banco "Cadastro" 
    const mongoURI = 'mongodb://127.0.0.1:27017/Cadastro';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
    console.log(`Banco de dados: ${conn.connection.name}`);
    console.log(`Collection: usuarios`);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    console.log('\nVerifique se o MongoDB está rodando:');
    console.log('1. Abra o MongoDB Compass e veja se consegue conectar em mongodb://localhost:27017');
    console.log('2. Verifique se o serviço MongoDB está rodando: services.msc');
    console.log('3. Tente: net start MongoDB (como administrador)');
    process.exit(1);
  }
};

module.exports = connectDB;
