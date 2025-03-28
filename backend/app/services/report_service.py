from sqlalchemy import func
from app import db
from app.models import Entry, Exit, Product

def get_report_data(product, month):
    entries = db.session.query(
        Entry.date_time,
        Entry.product_id,
        Product.name.label('product_name'),
        func.sum(Entry.quantity).label('total_entries')
    ).join(Product, Entry.product_id == Product.id)

    # Aplica filtros
    if product != 'all':
        entries = entries.filter(Entry.product_id == product)

    if month != 'all':
        entries = entries.filter(func.to_char(Entry.date_time, 'Mon - YYYY') == month)

    entries = entries.group_by(Entry.date_time, Entry.product_id, Product.name).all()

    exits = db.session.query(
        Exit.date_time,
        Exit.product_id,
        Product.name.label('product_name'),
        func.sum(Exit.quantity).label('total_exits')
    ).join(Product, Exit.product_id == Product.id)

    # Aplica filtros
    if product != 'all':
        exits = exits.filter(Exit.product_id == product)

    if month != 'all':
        exits = exits.filter(func.to_char(Exit.date_time, 'Mon - YYYY') == month)

    exits = exits.group_by(Exit.date_time, Exit.product_id, Product.name).all()

    data = []

    # Adicionando as entradas
    for entry in entries:
        data.append({
            'date_time': entry.date_time,
            'entry_or_exit': 'Entrada',
            'product_id': entry.product_id,
            'product_name': entry.product_name,
            'total_entries': entry.total_entries,
            'total_exits': 0
        })

    # Adicionando as saídas
    for exit_item in exits:
        data.append({
            'date_time': exit_item.date_time,
            'entry_or_exit': 'Saída',
            'product_id': exit_item.product_id,
            'product_name': exit_item.product_name,
            'total_entries': 0,
            'total_exits': exit_item.total_exits
        })

    return data
