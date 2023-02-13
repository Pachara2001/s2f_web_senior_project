from flask_sqlalchemy import SQLAlchemy
from google.cloud.sql.connector import Connector, IPTypes
import os
PASSWORD =os.getenv('PASSWORD')
PUBLIC_IP_ADDRESS =os.getenv('PUBLIC_IP_ADDRESS')
DBNAME =os.getenv('DBNAME')
CONNECTION_NAME=os.getenv('CONNECTION_NAME')
USER=os.getenv('USER')
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

# Function that initializes the db and creates the tables
def db_init(app):
    # app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:mypassword@localhost/data"
    # app.config["SQLALCHEMY_DATABASE_URI"] =n "sqlite:///data.db"
    app.config["SQLALCHEMY_DATABASE_URI"]="postgresql+pg8000://"
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    "creator": getconn
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
    db.init_app(app)
    # Creates the logs tables if the db doesnt already exist
    with app.app_context():
        db.create_all()