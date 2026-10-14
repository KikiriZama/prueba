const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.get('/api/productos', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('inventario_db');
    const productos = await db.collection('productos').find({}).toArray();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/productos', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('inventario_db');
    await db.collection('productos').insertOne(req.body);
    res.json({ mensaje: 'Producto guardado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));