import random
from datetime import datetime, timedelta

from app import db
from app.models import Product, Entry, Exit 
from run import app


def generate_dummy_data():
    with app.app_context(): 
        db.session.begin()

        product_data = [
            ("iPhone 15", "Apple", "Eletrônico"),
            ("Notebook Dell XPS", "Dell", "Eletrônico"),
            ("Monitor LG 27''", "LG", "Eletrônico"),
            ("Câmera Canon EOS", "Canon", "Eletrônico"),
            ("Chocolate Nestlé", "Nestlé", "Alimento"),
            ("Arroz Tio João", "Tio João", "Alimento"),
            ("Macarrão Barilla", "Barilla", "Alimento"),
            ("Martelo Stanley", "Stanley", "Ferramenta"),
            ("Chave de fenda Tramontina", "Tramontina", "Ferramenta"),
            ("Furadeira Bosch", "Bosch", "Ferramenta"),
            ("Camisa Polo Lacoste", "Lacoste", "Roupas"),
            ("Tênis Nike Air Max", "Nike", "Roupas"),
            ("Calça Jeans Levi's", "Levi's", "Roupas"),
            ("Smartwatch Samsung", "Samsung", "Eletrônico"),
            ("Bicicleta Caloi", "Caloi", "Esporte"),
            ("Teclado Mecânico Logitech", "Logitech", "Eletrônico"),
            ("Cadeira Gamer DXRacer", "DXRacer", "Móveis"),
            ("Fone de Ouvido JBL", "JBL", "Eletrônico"),
            ("Mochila Adidas", "Adidas", "Acessório"),
            ("Cafeteira Nespresso", "Nespresso", "Eletrodoméstico"),
        ]

        selected_products = random.sample(product_data, k=20)

        locations = ["Armazém 1", "Armazém 2", "Loja Central", "Filial Norte"]
        products = []

        for name, manufacturer, type_ in selected_products:
            existing_product = Product.query.filter_by(name=name).first()
            if existing_product:
                products.append(existing_product) 
                continue

            product = Product(
                name=name,
                registration_number=f"REG-{random.randint(1000, 9999)}",
                manufacturer=manufacturer,
                type=type_,
                description=f"Descrição de {name}"
            )
            db.session.add(product)
            products.append(product)

        db.session.flush()  # Garante IDs antes de criar entradas e saídas

        # Criando entradas e saídas para cada produto
        for product in products:
            entry_dates = sorted(
                [datetime.now() - timedelta(days=random.randint(1, 365)) for _ in range(random.randint(3, 7))])
            exit_dates = sorted(
                [datetime.now() - timedelta(days=random.randint(1, 365)) for _ in range(random.randint(2, 5))])

            for date in entry_dates:
                date = date.replace(second=0, microsecond=0)
                entry = Entry(
                    quantity=random.randint(10, 100),
                    date_time=date,
                    location=random.choice(locations),
                    product_id=product.id
                )
                db.session.add(entry)

            for date in exit_dates:
                date = date.replace(second=0, microsecond=0)
                exit_record = Exit(
                    quantity=random.randint(1, 50),
                    date_time=date,
                    location=random.choice(locations),
                    product_id=product.id
                )
                db.session.add(exit_record)

        db.session.commit()
        print("Dados fictícios inseridos com sucesso!")


if __name__ == "__main__":
    generate_dummy_data()
