import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Verifica se o header 'authorization' está presente
  const authHeader = req.headers['authorization'];

  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou inválido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Verifica se o token existe
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  // Valida o token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    // Se o token for válido, decodifica e coloca as informações do usuário na requisição
    req.usuario = decoded;
    next();
  });
};

export default authMiddleware;