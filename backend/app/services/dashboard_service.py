from sqlalchemy import func
from app import db
from app.models import Entry, Exit, Product

def get_entries_data():
    # Consulta de entradas agrupadas por mês e produto com nome do produto
    return db.session.query(
        func.date_trunc('month', Entry.date_time).label('month'),
        Entry.product_id,
        Product.name.label('product_name'),
        func.sum(Entry.quantity).label('total_entries')
    ).join(Product, Entry.product_id == Product.id).group_by('month', Entry.product_id, Product.name).all()

def get_exits_data():
    # Consulta de saídas agrupadas por mês e produto com nome do produto
    return db.session.query(
        func.date_trunc('month', Exit.date_time).label('month'),
        Exit.product_id,
        Product.name.label('product_name'),
        func.sum(Exit.quantity).label('total_exits')
    ).join(Product, Exit.product_id == Product.id).group_by('month', Exit.product_id, Product.name).all()

def organize_data(entries, exits):
    data = []

    # Agrupar entradas e saídas por produto e mês
    all_product_ids = set(entry.product_id for entry in entries).union(set(exit.product_id for exit in exits))
    all_product_names = {entry.product_id: entry.product_name for entry in entries}
    all_product_names.update({exit_item.product_id: exit_item.product_name for exit_item in exits})

    for product_id in all_product_ids:
        for month in set(entry.month for entry in entries).union(set(exit.month for exit in exits)):
            # Buscar entradas e saídas para o produto e mês
            total_entries = sum(entry.total_entries for entry in entries if entry.product_id == product_id and entry.month == month)
            total_exits = sum(exit.total_exits for exit in exits if exit.product_id == product_id and exit.month == month)

            # Adicionando dados no formato desejado
            data.append({
                'month': month.strftime('%m/%y'),
                'year': month.year,
                'month_number': month.month,
                'product_id': product_id,
                'product_name': all_product_names[product_id],
                'total_entries': total_entries,
                'total_exits': total_exits,
            })

    # Ordenação por ano e mês (usando year e month_number para garantir a ordenação correta)
    return sorted(data, key=lambda x: (x['year'], x['month_number']))
