from .. import db

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    manufacturer = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))

    def __repr__(self):
        return f"<Product {self.name} - {self.registration_number}>"

    # Método to_dict
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'registration_number': self.registration_number,
            'manufacturer': self.manufacturer,
            'type': self.type,
            'description': self.description
        }
