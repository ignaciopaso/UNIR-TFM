const express = require('express');
const app = express();
const { spawn } = require('child_process');

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

app.post('/predecirOcupacion', (req, res) => {
  const { cluster, features } = req.body;

  // Llamar a la función que hace la predicción
  predecirCluster(cluster, features, 0, (err, prediccion) => {
      if (err) {
          return res.status(500).send({ error: err });
      }
      res.send({ prediccion: prediccion });
  });
});
app.post('/predecirPrecio', (req, res) => {
  const { cluster, features } = req.body;

  // Llamar a la función que hace la predicción
  predecirCluster(cluster, features, 1, (err, prediccion) => {
      if (err) {
          return res.status(500).send({ error: err });
      }
      res.send({ prediccion: prediccion });
  });
});

// Función para predecir usando el modelo del clúster adecuado
function predecirCluster(cluster, features, tipo, callback) {
  // Cargar el script de Python y pasarle los datos
  let pythonProcess = spawn('python', ['predict_cluster.py']);
  if(tipo == 0){
    pythonProcess = spawn('python', ['predict_cluster.py']);
  }else if(tipo == 1){
    pythonProcess = spawn('python', ['predict_cluster_prices.py']);
  }

  // Preparar los datos a enviar al script
  const data = JSON.stringify({ cluster: cluster, features: features });

  // Enviar los datos al script Python
  pythonProcess.stdin.write(data);
  pythonProcess.stdin.end();

  // Recibir la predicción de vuelta
  pythonProcess.stdout.on('data', (data) => {
      const prediccion = JSON.parse(data.toString());
      callback(null, prediccion);
  });

  // Manejar errores
  pythonProcess.stderr.on('data', (data) => {
      callback(data.toString(), null);
  });
}

// Función de optimización básica
function optimizarPrecio(ocupacionPredicha, precioBase) {
  let precio;
  if (ocupacionPredicha < 0.5) {
      precio = precioBase * 0.9; // 10% de descuento
  } else if (ocupacionPredicha >= 0.5 && ocupacionPredicha < 0.8) {
      precio = precioBase * 1.1; // 10% de incremento
  } else {
      precio = precioBase * 1.25; // 25% de incremento
  }
  return precio;
}

// Endpoint para calcular el precio optimizado
app.post('/optimizar-precio', (req, res) => {
  const { ocupacionPredicha, precioBase } = req.body;

  // Calcular el precio optimizado
  const precioOptimizado = optimizarPrecio(ocupacionPredicha, precioBase);

  // Enviar el resultado
  res.json({ precioOptimizado });
});

// Configuración del puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
