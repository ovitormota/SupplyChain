from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS  # Importando o CORS

# Inicialização do banco de dados e migrações
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')  # Importa as configurações
    db.init_app(app)  # Inicializa o banco de dados
    migrate.init_app(app, db)  # Inicializa as migrações

    # Configuração do CORS
    CORS(app)  # Permite que todas as origens acessem a API. Pode ser customizado conforme necessário

    # Importando e registrando as rotas
    from .routes import register_routes  # Importa a função de registrar as rotas
    register_routes(app)  # Chama a função para registrar os blueprints

    return app
