from ..databaseDEV.db_configure import db
class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    attendees = db.Column(db.JSON)  # Store attendees as a JSON array
    payment = db.Column(db.String(50))  # Store payment method