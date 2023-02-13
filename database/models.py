from database.db import db

class Record(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    createDate = db.Column(db.DateTime,nullable=False)
    updateDate = db.Column(db.DateTime,nullable=False)
    originalImg = db.Column(db.String(),nullable=False)
    genImg = db.Column(db.String(),nullable=False)
    realImg = db.Column(db.String(),nullable=True)
    def __init__(self, time, originalImg,genImg):
        self.createDate = time
        self.updateDate = time
        self.originalImg = originalImg
        self.genImg = genImg
    


