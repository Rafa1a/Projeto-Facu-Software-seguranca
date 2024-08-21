const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const app = express()

app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Chave secreta para assinar o token
const SECRET_KEY = 'chave_secreta_aqui';

//Endpoint para login do usuário

//  Dados do body da requisição: {"username" : "user", "password" : "123456"}

//  Verifique mais abaixo, no array users, os dados dos usuários existentes na app
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body;

    let userData;
    userData = doLogin(credentials);
    console.log(userData)
    if (userData) {
        // Cria o token JWT
        const token = jwt.sign({ usuario_id: userData.id, perfil: userData.perfil }, SECRET_KEY, { expiresIn: '1h' }); // Expira em 1 hora
        res.json({ token: token });
    } else {
        res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
});


// Middleware para validar o token JWT e verificar o perfil do usuário
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Adiciona as informações do usuário decodificadas do token ao objeto req
        req.user = decoded;

        // Verifica se o usuário tem perfil 'admin'
        if (req.user.perfil !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas usuários admin podem acessar este recurso.' });
        }
        // Chama o próximo middleware ou endpoint
        next(); 
    });
};
  
//Endpoint para recuperação dos dados de todos os usuários cadastrados
app.get('/api/users', authenticateAdmin, (req, res) => {
    res.status(200).json({ data: users });
});

//Endpoint para recuperação dos contratos existentes
app.get('/api/contracts/:empresa/:inicio', authenticateAdmin, (req, res) => {
    const { empresa, inicio } = req.params;

    // Usar o método de busca de contratos com validação
    const result = getContracts(empresa, inicio);

    if (result) {
        res.status(200).json({ data: result });
    } else {
        res.status(404).json({ message: 'Dados Não encontrados' });
    }
});
  
// Middleware para verificar o token JWT no header da requisição
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      console.log(user)
      req.user = user;
      next();
    });
}

// Endpoint para recuperação dos dados do usuário logado
app.get('/api/me', authenticateToken, (req, res) => {
    // Busca os dados do usuário com base no ID presente no token JWT
    console.log(req.user)
    const userData = users.find(user => user.id === req.user.usuario_id);
    console.log(userData)
    if (userData) {
        res.status(200).json({ data: userData });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

   
///////////////////////////////////////////////////////////////////////////////////
///
 
//Mock de dados
const users = [

  {"username" : "user", "password" : "123456", "id" : 123, "email" : "user@dominio.com",
"perfil": "user"},

  {"username" : "admin", "password" : "123456789", "id" : 124, "email" :
"admin@dominio.com", "perfil": "admin"},

  {"username" : "colab", "password" : "123", "id" : 125, "email" : "colab@dominio.com",
"perfil": "user"},

]

//APP SERVICES
function doLogin(credentials){

  let userData
    
  userData = users.find(item => {

    if(credentials?.username === item.username && credentials?.password ===
item.password)

      return item;

  });

  return userData;

}
 
//Classe fake emulando um script externo, responsável pela execução de queries no banco de dados
class Repository{

  execute(query){

    return [];

  }

}

// Função para validar parâmetros de entrada usando expressões regulares
function validateParameters(empresa, inicio) {
    // Permitir apenas letras, números e alguns caracteres específicos
    const empresaRegex = /^[a-zA-Z0-9\s]+$/;
    // Espera um formato de data YYYY-MM-DD
    const inicioRegex = /^\d{4}-\d{2}-\d{2}$/; 

    if (!empresaRegex.test(empresa)) {
        throw new Error('Parâmetro "empresa" contém caracteres inválidos.');
    }

    if (!inicioRegex.test(inicio)) {
        throw new Error('Parâmetro "inicio" não está no formato YYYY-MM-DD.');
    }
}
  
  // Recupera, no banco de dados, os dados dos contratos com validação dos parâmetros
function getContracts(empresa, inicio) {
    try {
        // Validar parâmetros
        validateParameters(empresa, inicio);

        // Construção segura da query usando parâmetros validados
        const repository = new Repository();
        const query = `SELECT * FROM contracts WHERE empresa = ? AND data_inicio = ?`;
        
        // Supondo que o método 'execute' aceitaria parâmetros substituíveis para evitar injection
        const result = repository.execute(query, [empresa, inicio]);

        return result;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}
  