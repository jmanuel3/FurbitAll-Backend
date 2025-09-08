const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (!token || (scheme || '').toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Token no enviado o con formato inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id, _id, role, email } = decoded || {};
    req.user = {
      id: id || _id,               
      role: role || 'user',        
      email: email || undefined,
      
    };

    return next();
  } catch (err) {
    
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = verifyToken;
