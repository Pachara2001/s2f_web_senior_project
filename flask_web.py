import requests
from flask import Flask, render_template , request ,send_file
from database.db import db , db_init
from database.models import Record
import datetime
import os
import boto3
import secrets
from dotenv import load_dotenv

app = Flask(__name__)
db_init(app)
api_url = 'http://localhost:5000/image'
oriImgPath="static\oriImg.jpg"
genImgPath='static\genImg.png'
tempImgPath='static\\tempImg.png'

load_dotenv()

ACCESS_KEY_ID = os.getenv('ACCESS_KEY')
SECRET_ACCESS_KEY = os.getenv('SECRET_ACCESS_KEY')
BUCKET_NAME = os.getenv('BUCKET_NAME')

session = boto3.Session(
    aws_access_key_id = ACCESS_KEY_ID,
    aws_secret_access_key = SECRET_ACCESS_KEY
)

s3 = session.client('s3')

file_name = 'test.jpg'

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/')
def home():
    return render_template('template.html')

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
    with open(oriImgPath, 'rb') as f:
        s3.upload_fileobj(f, BUCKET_NAME, oriName)
    with open(genImgPath,'rb') as f:
        s3.upload_fileobj(f, BUCKET_NAME, genName)
    # my_json_obj = json.dumps({"originalImg" : oriName,"genImg" : genName})
    # headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    code=saveDB(oriName,genName)
    if(code==200):
        return "data save!",200
    else:
        return "something wrong",500

@app.route('/records')
def showRecords():
    return render_template('records.html', records=db.session.execute(db.select(Record).order_by(Record.id)).scalars())

@app.route('/detail')
def datail():
    return render_template('detail.html')

@app.route('/getImage/<type>/<id>' ,methods=['GET'])
def getImage(type,id):
    record = db.session.execute(db.select(Record).filter_by(id=id)).scalar_one()
    if(type=='ori'):
        s3_object = s3.get_object(Bucket=BUCKET_NAME, Key=record.originalImg)
    elif(type=='gen'):
        s3_object = s3.get_object(Bucket=BUCKET_NAME, Key=record.genImg)
    elif(record.realImg != None):
        s3_object = s3.get_object(Bucket=BUCKET_NAME, Key=record.realImg)
    else:
        return 404
    file_data = s3_object['Body'].read()
    with open(tempImgPath, 'wb') as f:
            f.write(file_data)   
    return send_file(tempImgPath, mimetype='image/png')

@app.route('/updateRealImg/<id>' ,methods=['POST'])
def updateRealImg(id):
    record = db.session.execute(db.select(Record).filter_by(id=id)).scalar_one()
    realImg = request.files["image"]
    realImg.save(tempImgPath)
    name=record.originalImg.replace("ori","real")
    with open(tempImgPath, 'rb') as f:
        s3.upload_fileobj(f, BUCKET_NAME, name)
    record.realImg = name
    record.updateDate = datetime.datetime.now()
    db.session.commit()
    return 200


if __name__ == '__main__':
    app.debug = True
    app.run(port=8000)
