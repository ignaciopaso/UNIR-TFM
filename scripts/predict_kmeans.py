{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "b7a6b38f-d648-4f1b-92e2-9fce6a7fcd8e",
   "metadata": {},
   "outputs": [],
   "source": [
    "import sys\n",
    "import json\n",
    "import numpy as np\n",
    "import joblib\n",
    "from sklearn.preprocessing import StandardScaler\n",
    "\n",
    "# Cargar el modelo K-Means\n",
    "kmeans = joblib.load('kmeans_model.pkl')\n",
    "\n",
    "# Escalar los datos de entrada (suponiendo que usaste un escalador)\n",
    "scaler = StandardScaler()\n",
    "\n",
    "# Recibir los datos enviados desde Node.js\n",
    "data_input = sys.argv[1]\n",
    "data_input = json.loads(data_input)\n",
    "\n",
    "# Convertir los datos a un array NumPy\n",
    "data_input = np.array(data_input).reshape(1, -1)\n",
    "\n",
    "# Escalar los datos de entrada (si usaste escalador en el entrenamiento)\n",
    "data_input_scaled = scaler.fit_transform(data_input)\n",
    "\n",
    "# Hacer la predicción del clúster\n",
    "cluster = kmeans.predict(data_input_scaled)\n",
    "\n",
    "# Devolver el número del clúster\n",
    "print(cluster[0])\n"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.11.5"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
