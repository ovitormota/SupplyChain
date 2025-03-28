from flask import Blueprint, request, jsonify
from app.services.product_service import (
    register_product_service,
    list_products_service,
    list_products_native_service,
    get_product_service,
    update_product_service,
    delete_product_service
)

bp = Blueprint('product_routes', __name__)

@bp.route('', methods=['POST'])
def register_product():
    data = request.get_json()
    product = register_product_service(data)
    return jsonify({"message": "Product successfully registered!"}), 201

@bp.route('', methods=['GET'])
def list_products():
    products = list_products_service()
    return jsonify([product.to_dict() for product in products])

@bp.route('/native', methods=['GET'])
def list_products_native():
    products = list_products_native_service()
    return jsonify(products)

@bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = get_product_service(id)
    return jsonify(product.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    product = update_product_service(id, data)
    return jsonify({"message": "Product successfully updated!"})

@bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    delete_product_service(id)
    return jsonify({"message": "Product successfully deleted!"})
