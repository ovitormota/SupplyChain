from .. import db

class Exit(db.Model):
    __tablename__ = 'exit'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', backref=db.backref('exits', lazy=True))

    def __repr__(self):
        return f"<Exit {self.quantity} - {self.product.name} from {self.location}>"

    # Método to_dict
    def to_dict(self):
        return {
            'id': self.id,
            'quantity': self.quantity,
            'date_time': self.date_time.isoformat(),
            'location': self.location,
            'product_id': self.product_id,
            'product': self.product.to_dict()
        }
