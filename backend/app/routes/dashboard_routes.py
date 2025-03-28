from flask import Blueprint, jsonify
from app.services.dashboard_service import get_entries_data, get_exits_data, organize_data

bp = Blueprint('dashboard', __name__)

@bp.route('', methods=['GET'])
def get_entries_exits():
    try:
        entries = get_entries_data()
        exits = get_exits_data()

        # Organizar os dados
        sorted_data = organize_data(entries, exits)

        return jsonify(sorted_data)

    except Exception as e:
        return jsonify({'error': 'Erro ao carregar dados', 'details': str(e)}), 500
