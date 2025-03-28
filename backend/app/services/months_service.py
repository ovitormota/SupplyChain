from app import db
from app.models import Entry, Exit
from sqlalchemy import func

def get_months_data(product):
    try:
        # Consultar os meses a partir das Entradas
        entry_query = db.session.query(
            func.to_char(Entry.date_time, 'Mon - YYYY').label('month')
        ).distinct()

        # Se o produto for especificado, filtra pelas entradas do produto
        if product != 'all':
            entry_query = entry_query.filter(Entry.product_id == product)

        entry_months = entry_query.all()

        # Consultar os meses a partir das Saídas
        exit_query = db.session.query(
            func.to_char(Exit.date_time, 'Mon - YYYY').label('month')
        ).distinct()

        # Se o produto for especificado, filtra pelas saídas do produto
        if product != 'all':
            exit_query = exit_query.filter(Exit.product_id == product)

        exit_months = exit_query.all()

        # Unir as listas de meses de entradas e saídas
        months = set([entry[0] for entry in entry_months] + [exit[0] for exit in exit_months])

        return list(months)

    except Exception as e:
        raise Exception(f"Erro ao carregar meses: {str(e)}")
