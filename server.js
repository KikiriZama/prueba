const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (index.html, practica2.html, etc.)
app.use(express.static(__dirname));

const uri = process.env.MONGO_URI;

// Endpoint para consultar productos
app.get('/api/productos', async (req, res) => {
  if (!uri) {
    return res.status(500).json({ error: 'La variable MONGO_URI no está configurada en Azure.' });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('inventario_db');
    const productos = await db.collection('productos').find({}).toArray();
    res.json(productos);
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

// Endpoint para registrar un nuevo producto
app.post('/api/productos', async (req, res) => {
  if (!uri) {
    return res.status(500).json({ error: 'La variable MONGO_URI no está configurada en Azure.' });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('inventario_db');
    await db.collection('productos').insertOne(req.body);
    res.json({ mensaje: 'Producto guardado correctamente' });
  } catch (err) {
    console.error('Error al insertar producto:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
