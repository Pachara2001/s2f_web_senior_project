from database.db import db

class Record(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    createDate = db.Column(db.DateTime,nullable=False)
    updateDate = db.Column(db.DateTime,nullable=False)
    originalImg = db.Column(db.Text,nullable=False)
    genImg = db.Column(db.Text,nullable=False)
    realImg = db.Column(db.Text,nullable=True)
    def __init__(self, time, originalImg,genImg):
        self.createDate = time
        self.updateDate = time
        self.originalImg = originalImg
        self.genImg = genImg
    


