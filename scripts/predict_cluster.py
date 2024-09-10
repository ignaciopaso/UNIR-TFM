import sys
import json
from tensorflow.keras.models import load_model
import numpy as np

# Recibir el clúster y los datos desde la entrada estándar (stdin)
input_data = sys.stdin.read()
data = json.loads(input_data)

# Cargar los modelos según el clúster recibido
if data['cluster'] == 0:
    model = load_model('modelo_cluster_0.h5')
elif data['cluster'] == 1:
    model = load_model('modelo_cluster_1.h5')
elif data['cluster'] == 2:
    model = load_model('modelo_cluster_2.h5')

# Convertir los datos de entrada en un array de NumPy para predecir
X = np.array(data['features'])

# Hacer la predicción
pred = model.predict(X)

# Devolver la predicción como JSON
print(json.dumps(pred.tolist()))
