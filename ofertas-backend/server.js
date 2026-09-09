require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

// 1. IMPORTAR RUTAS
const offerRoutes = require('./routes/offerRoutes');
const authRoutes = require('./routes/authRoutes'); // 👈 AGREGADO: Asegúrate de ajustar la ruta al archivo real

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 2. REGISTRAR RUTAS API
app.use('/api/offers', offerRoutes);
app.use('/api/auth', authRoutes); // 👈 AGREGADO: Ahora responde a /api/auth/register y /api/auth/login

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ofertas_polonia';

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

let serverInstance = null;

async function connectWithRetry(attempt = 0) {
  const maxAttempts = 10;
  const backoff = Math.min(30000, 1000 * Math.pow(2, attempt));

  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('✅ Conectado exitosamente a MongoDB');

    if (!serverInstance) {
      serverInstance = app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error(`❌ Error al conectar a MongoDB (intento ${attempt + 1}):`, err.message || err);
    if (attempt < maxAttempts) {
      console.log(`Reintentando conexión en ${backoff}ms...`);
      setTimeout(() => connectWithRetry(attempt + 1), backoff);
    } else {
      console.error('Se agotaron los reintentos de conexión a MongoDB. Revise MONGO_URI y la disponibilidad de la base.');
    }
  }
}

// Listeners para diagnosticar desconexiones
mongoose.connection.on('connected', () => {
  console.log('Mongoose: conexión establecida.');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose: error de conexión:', err && err.message ? err.message : err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose: conexión descartada. Intentando reconectar...');
  connectWithRetry();
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose: reconectado.');
});

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  console.log('SIGINT recibido. Cerrando conexión a MongoDB...');
  try {
    await mongoose.connection.close(false);
    console.log('Conexión a MongoDB cerrada.');
  } catch (e) {
    console.error('Error cerrando conexión a MongoDB:', e);
  }
  process.exit(0);
});

connectWithRetry();