from app import db
from app.models import Exit
from datetime import datetime


def register_exit_service(data):
    exit_ = Exit(**data)
    db.session.add(exit_)
    db.session.commit()
    return exit_


def list_exits_service():
    return Exit.query.all()


def get_exit_service(id):
    return Exit.query.get_or_404(id)


def update_exit_service(id, data):
    exit_ = Exit.query.get_or_404(id)

    exit_.product_id = data.get('product_id', exit_.product_id)
    exit_.quantity = data.get('quantity', exit_.quantity)
    exit_.date_time = data.get('date_time', exit_.date_time)
    exit_.location = data.get('location', exit_.location)

    db.session.commit()
    return exit_


def delete_exit_service(id):
    exit_ = Exit.query.get_or_404(id)
    db.session.delete(exit_)
    db.session.commit()
