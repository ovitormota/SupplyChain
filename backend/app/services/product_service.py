from app import db
from app.models import Product
from sqlalchemy import text


def register_product_service(data):
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return product


def list_products_service():
    return Product.query.all()


def list_products_native_service():
    query = text("SELECT id, name, registration_number, manufacturer, type, description FROM product")
    result = db.session.execute(query)
    return [
        {column: value for column, value in zip(result.keys(), row)}
        for row in result.fetchall()
    ]


def get_product_service(id):
    return Product.query.get_or_404(id)


def update_product_service(id, data):
    product = Product.query.get_or_404(id)

    product.name = data.get('name', product.name)
    product.registration_number = data.get('registration_number', product.registration_number)
    product.manufacturer = data.get('manufacturer', product.manufacturer)
    product.type = data.get('type', product.type)
    product.description = data.get('description', product.description)

    db.session.commit()
    return product


def delete_product_service(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
