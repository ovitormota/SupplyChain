from flask import Blueprint, jsonify, request
from app.services.months_service import get_months_data

bp = Blueprint('months', __name__)

@bp.route('', methods=['GET'])
def get_months():
    try:
        product = request.args.get('product', 'all')

        # Chama o serviço para obter os meses
        months = get_months_data(product)

        return jsonify(sorted(months)), 200

    except Exception as e:
        return jsonify({'error': 'Erro ao carregar meses', 'details': str(e)}), 500
