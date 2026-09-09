const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Instálalo si no lo tienes: npm install bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 👈 Asegúrate de que apunte a tu modelo de Mongoose

const jwtSecret = process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion';

// 1. REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Buscar en MongoDB si el correo ya existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear la instancia del documento en MongoDB 📌
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    // GUARDAR EN LA BASE DE DATOS
    await newUser.save();

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan email o contraseña' });
    }

    // Buscar al usuario en MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con el hash guardado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    return res.json({
      token: jwt.sign(
        { id: user._id.toString(), role: user.role },
        jwtSecret,
        { expiresIn: '8h' }
      ),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;