import sys
import os

# Ajoute le chemin du projet
path = '/home/Yahyael/atlas-lions-backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Charge les variables d'environnement
from dotenv import load_dotenv
load_dotenv(os.path.join(path, '.env'))

# Import l'app FastAPI
from main import app

# Pour PythonAnywhere
application = app
