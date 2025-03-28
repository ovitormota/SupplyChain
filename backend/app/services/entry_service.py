from app import db
from app.models import Entry
from datetime import datetime


def register_entry_service(data):
    entry = Entry(**data)
    db.session.add(entry)
    db.session.commit()
    return entry


def list_entries_service():
    return Entry.query.all()


def get_entry_service(id):
    return Entry.query.get_or_404(id)


def update_entry_service(id, data):
    entry = Entry.query.get_or_404(id)

    entry.product_id = data.get('product_id', entry.product_id)
    entry.quantity = data.get('quantity', entry.quantity)
    entry.date_time = data.get('date_time', entry.date_time)
    entry.location = data.get('location', entry.location)

    db.session.commit()
    return entry


def delete_entry_service(id):
    entry = Entry.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
