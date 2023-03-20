from flask_sqlalchemy import SQLAlchemy
from google.cloud.sql.connector import Connector, IPTypes
import os
from dotenv import load_dotenv
load_dotenv()
PASSWORD =os.environ.get('PASSWORD')
PUBLIC_IP_ADDRESS =os.environ.get('PUBLIC_IP_ADDRESS')
DBNAME =os.environ.get('DBNAME')
CONNECTION_NAME=os.environ.get('CONNECTION_NAME')
USER=os.environ.get('USER')
db = SQLAlchemy()

def getconn():
    with Connector() as connector:
        conn = connector.connect(
            CONNECTION_NAME, # Cloud SQL Instance Connection Name
            "pg8000",
            user=USER,
            password=PASSWORD,
            db=DBNAME,
            ip_type= IPTypes.PUBLIC  # IPTypes.PRIVATE for private IP
        )
        return conn

def db_init(app):
    app.config["SQLALCHEMY_DATABASE_URI"]="postgresql+pg8000://"
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "creator": getconn
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
    db.init_app(app)
    with app.app_context():
        db.create_all()