import os
from sqlalchemy import Column, String, Integer
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
from ..vars import SECRET_KEY

database_filename = "database.db"
project_dir = os.path.dirname(os.path.abspath(__file__))
database_path = F"sqlite:///{os.path.join(project_dir, database_filename)}"

db = SQLAlchemy()


def setup_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = SECRET_KEY
    db.app = app
    migrate = Migrate(app, db, compare_type=True)
    migrate.init_app(app, db)
    db.init_app(app)
    


def db_drop_and_create_all():
    db.drop_all()
    db.create_all()
    # add one demo row which is helping in POSTMAN test
    drink = Drink(
        title='water',
        recipe='[{"name": "water", "color": "blue", "parts": 1}]'
    )

    drink.insert()


class Drink(db.Model):
    # Autoincrementing, unique primary key
    id = Column(Integer().with_variant(Integer, "sqlite"), primary_key=True)
    # String Title
    title = Column(String(80), unique=True)
    # the ingredients blob - this stores a lazy json blob
    # the required datatype is [{'color': string, 'name':string, 'parts':number}]
    recipe = Column(String(180), nullable=False)

    

    def short(self):
        print(json.loads(self.recipe))
        short_recipe = [{'color': r['color'], 'parts': r['parts']} for r in json.loads(self.recipe)]
        return {
            'id': self.id,
            'title': self.title,
            'recipe': short_recipe
        }


    def long(self):
        return {
            'id': self.id,
            'title': self.title,
            'recipe': json.loads(self.recipe)
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()


    def delete(self):
        db.session.delete(self)
        db.session.commit()


    def update(self):
        db.session.commit()

    def __repr__(self):
        return json.dumps(self.short())
