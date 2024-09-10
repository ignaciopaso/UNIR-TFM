const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde tu API!');
});
app.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({ mensaje: 'Datos recibidos', data });
  });

// Endpoint para recibir los datos y devolver el clúster
app.post('/cluster', (req, res) => {
  const datos = req.body.datos;  // Datos de la solicitud (nueva reserva)

  // Ejecutar el script Python que realiza el agrupamiento
  exec(`python3 predict_kmeans.py '${JSON.stringify(datos)}'`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error al ejecutar el script Python: ${error.message}`);
          return res.status(500).send("Error en la clasificación");
      }
      if (stderr) {
          console.error(`Error en el script Python: ${stderr}`);
          return res.status(500).send("Error en la clasificación");
      }
      
      // Devolver el clúster asignado
      res.json({ cluster: stdout.trim() });
  });
});


// Configuración del puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
