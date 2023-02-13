import requests
from flask import Flask, render_template , request ,send_file
from database.db import db , db_init
from database.models import Record
import datetime
import os
import secrets
from dotenv import load_dotenv
from google.cloud import storage
from google.oauth2.service_account import Credentials

app = Flask(__name__)
db_init(app)
load_dotenv()

GCP_CREDENTIALS = os.getenv('GCP_CREDENTIALS')
BUCKET_NAME = os.getenv('BUCKET_NAME')
API_URL = os.getenv("API_URL")


api_url = API_URL + '/image'
web_url = os.environ.get("url","http://localhost:")+str(os.environ.get("PORT",5000))
oriImgPath="static\oriImg.jpg"
genImgPath='static\genImg.png'
tempImgPath='static\\tempImg.png'

# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GCP_CREDENTIALS
credentials = Credentials.from_service_account_file(GCP_CREDENTIALS)

storage_client = storage.Client(credentials=credentials)

storage_client = storage.Client()
bucket = storage_client.get_bucket(BUCKET_NAME)

file_name = 'test.jpg'

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/')
def home():
    return render_template('generate.html')

@app.route('/formHandling', methods=['POST' , 'GET'])
def formHandling():
    firstImg = request.files["image"]
    firstImg.save(oriImgPath)
    data={'image': open(oriImgPath, 'rb') }
    try:
        response= requests.post(api_url,files=data)
        secImg = response.content
        with open(genImgPath, 'wb') as f:
            f.write(secImg)    
        return send_file(genImgPath, mimetype='image/png')
    except requests.exceptions.RequestException as e:
        return str(e),500

# @app.route('/save', methods=['POST'])
def saveDB(oriImg,genImg):
    time = datetime.datetime.now()
    data = Record(time,oriImg,genImg)
    db.session.add(data)
    db.session.commit()
    return 200

@app.route('/save_img_to_db' , methods=['GET'])
def uploadImgToCloud():
    secretTok=secrets.token_hex(16)
    oriName="ori_"+secretTok+".jpg"
    genName="gen_"+secretTok+".png"
    
    ori_blob = bucket.blob('ori/'+oriName)
    gen_blob = bucket.blob('gen/'+genName)

    ori_blob.upload_from_filename(oriImgPath)
    gen_blob.upload_from_filename(genImgPath)
    
    code=saveDB(oriName,genName)
    if(code==200):
        return "data save!",200
    else:
        return "something wrong",500

@app.route('/records')
def showRecords():
    return render_template('records.html', records=db.session.execute(db.select(Record).order_by(Record.id)).scalars(),webUrl=web_url)

@app.route('/detail/<id>')
def datail(id):
    return render_template('detail.html',id=id)

@app.route('/getImage/<type>/<id>' ,methods=['GET'])
def getImage(type,id):
    id = int(id)
    record = db.session.execute(db.select(Record).filter_by(id=id)).scalar_one()
    if(type=='ori'):
        blob = bucket.get_blob("ori/"+record.originalImg)
    elif(type=='gen'):
        blob = bucket.get_blob("gen/"+record.genImg)
    elif(record.realImg != None):
        blob = bucket.get_blob("real/"+record.realImg)
    else:
        return 'notFound',404
    
    file_data = blob.download_as_string()   
    with open(tempImgPath, 'wb') as f:
            f.write(file_data)
            
    return send_file(tempImgPath, mimetype='image/png')

@app.route('/updateRealImg/<id>' ,methods=['POST'])
def updateRealImg(id):
    id = int(id)
    record = db.session.execute(db.select(Record).filter_by(id=id)).scalar_one()
    realImg = request.files["image"]
    realImg.save(tempImgPath)
    name=record.originalImg.replace("ori","real")
    
    real_blob = bucket.blob('real/'+name)
    real_blob.upload_from_filename(tempImgPath)
    
    record.realImg = name
    record.updateDate = datetime.datetime.now()
    db.session.commit()
    return 'ok',200


if __name__ == '__main__':
    app.run(host="0.0.0.0",debug = True,port=int(os.environ.get("PORT",8080)))
