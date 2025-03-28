from flask import Blueprint, request, jsonify
from app.services.entry_service import (
    register_entry_service,
    list_entries_service,
    get_entry_service,
    update_entry_service,
    delete_entry_service
)

bp = Blueprint('entry_routes', __name__)

@bp.route('', methods=['POST'])
def register_entry():
    data = request.get_json()
    entry = register_entry_service(data)
    return jsonify({"message": "Entry successfully recorded!"}), 201

@bp.route('', methods=['GET'])
def list_entries():
    entries = list_entries_service()
    return jsonify([entry.to_dict() for entry in entries])

@bp.route('/<int:id>', methods=['GET'])
def get_entry(id):
    entry = get_entry_service(id)
    return jsonify(entry.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
def update_entry(id):
    data = request.get_json()
    entry = update_entry_service(id, data)
    return jsonify({"message": "Entry successfully updated!"})

@bp.route('/<int:id>', methods=['DELETE'])
def delete_entry(id):
    delete_entry_service(id)
    return jsonify({"message": "Entry successfully deleted!"})
