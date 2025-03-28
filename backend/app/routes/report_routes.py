from flask import Blueprint, jsonify, request
from app.services.report_service import get_report_data

bp = Blueprint('report', __name__)

@bp.route('', methods=['GET'])
def get_report():
    try:
        product = request.args.get('product', 'all')
        month = request.args.get('month', 'all')

        # Chama o serviço para obter os dados do relatório
        data = get_report_data(product, month)

        return jsonify(sorted(data, key=lambda x: x['date_time'])), 200

    except Exception as e:
        return jsonify({'error': 'Erro ao carregar dados', 'details': str(e)}), 500
