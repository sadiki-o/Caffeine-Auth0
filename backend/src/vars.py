import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

#environment variables
SECRET_KEY = os.environ.get("APP_SECRET_KEY")
AUTH0_CLIENT_ID = os.environ.get("AUTH0_CLIENT_ID")
AUTH0_DOMAIN = os.environ.get("AUTH0_DOMAIN")
AUTH0_CLIENT_SECRET = os.environ.get("AUTH0_CLIENT_SECRET")
API_SECRET_KEY = os.environ.get("API_SECRET_KEY")
API_CLIENT_ID=os.environ.get("API_CLIENT_ID")