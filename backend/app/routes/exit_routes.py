from flask import Blueprint, request, jsonify
from app.services.exit_service import (
    register_exit_service,
    list_exits_service,
    get_exit_service,
    update_exit_service,
    delete_exit_service
)

bp = Blueprint('exit_routes', __name__)

@bp.route('', methods=['POST'])
def register_exit():
    data = request.get_json()
    exit_ = register_exit_service(data)
    return jsonify({"message": "Exit successfully recorded!"}), 201

@bp.route('', methods=['GET'])
def list_exits():
    exits = list_exits_service()
    return jsonify([exit_.to_dict() for exit_ in exits])

@bp.route('/<int:id>', methods=['GET'])
def get_exit(id):
    exit_ = get_exit_service(id)
    return jsonify(exit_.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
def update_exit(id):
    data = request.get_json()
    exit_ = update_exit_service(id, data)
    return jsonify({"message": "Exit successfully updated!"})

@bp.route('/<int:id>', methods=['DELETE'])
def delete_exit(id):
    delete_exit_service(id)
    return jsonify({"message": "Exit successfully deleted!"})
