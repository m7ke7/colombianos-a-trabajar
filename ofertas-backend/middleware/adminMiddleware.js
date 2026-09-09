const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion';

async function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Se requiere autenticación' });
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id).select('role');

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden gestionar ofertas' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = { requireAdmin };