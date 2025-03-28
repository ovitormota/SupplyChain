from .. import db

class Entry(db.Model):
    __tablename__ = 'entry'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', backref=db.backref('entries', lazy=True))

    def __repr__(self):
        return f"<Entry {self.quantity} - {self.product.name} at {self.location}>"

    # Método to_dict
    def to_dict(self):
        return {
            'id': self.id,
            'quantity': self.quantity,
            'date_time': self.date_time.isoformat(),  # Convertendo para string
            'location': self.location,
            'product_id': self.product_id,
            'product': self.product.to_dict()  # Incluindo a informação do produto
        }
