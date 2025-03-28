from flask import Blueprint
from app.routes.product_routes import bp as product_bp
from app.routes.entry_routes import bp as entry_bp
from app.routes.exit_routes import bp as exit_bp
from app.routes.dashboard_routes import bp as dashboard_bp
from app.routes.report_routes import bp as report_bp
from app.routes.month_routes import bp as month_bp

# Registrando os blueprints
def register_routes(app):
    app.register_blueprint(product_bp, url_prefix='/products')
    app.register_blueprint(entry_bp, url_prefix='/entries')
    app.register_blueprint(exit_bp, url_prefix='/exits')
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(report_bp, url_prefix='/report')
    app.register_blueprint(month_bp, url_prefix='/months')
