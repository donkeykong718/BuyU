from flask import Flask, request, jsonify
# , render_template

# import urllib.request
# import json
# import os

from peewee import *
from playhouse.shortcuts import model_to_dict, dict_to_model
import math


db = PostgresqlDatabase(
    'buyU',
    user='postgres',
    password='',
    host='localhost',
    port=5432
)


class BaseModel(Model):
    class Meta:
        database = db


class Product(BaseModel):
    UPC = IntegerField()
    productName = CharField()
    manufacturer = CharField()
    isUnion = BooleanField()
    unionName = CharField()
    createdBy = CharField()
    createdOn = DateTimeField()
    updatedBy = CharField()
    updatedOn = DateTimeField()


class Union(BaseModel):
    properName = CharField()
    nickName = CharField()
    locals = [IntegerField()]
    industry = CharField()
    website = CharField()
    description = CharField()


class User(BaseModel):
    userName = CharField()
    password = CharField()
    firstName = CharField()
    lastName = CharField()
    eMail = CharField()
    unionName = CharField()
    localName = CharField()
    title = CharField()


# DO IN SEED FILE
db.connect()
# db.drop_tables([Product], [Union], [User])
db.create_tables([Product])
db.create_tables([Union])
db.create_tables([User])


app = Flask(__name__)


@app.route('/')
def index():
    return "Hello, world!"


@app.route('/products/', methods=['GET', 'POST'])
@app.route('/products/<search>', methods=['GET'])
@app.route('/products/<id>', methods=['PUT', 'DELETE'])
def product(id=None, search=None):
    if request.method == 'GET':
        if search:
            if math.isnan(search) == False and len(search) == 12:
                product = Product.select().where(UPC=search).execute()
                return jsonify(model_to_dict(product))
            elif math.isnan(search) == False and len(search) < 12:
                product = Product.select_by_id(search)
                return jsonify(model_to_dict(product))
            elif search == 'True' or search == 'False':
                product = Product.select().where(isUnion=search).execute()
                return jsonify(model_to_dict(product))
            else:
                product = Product.select().where(
                    "productName LIKE '%search%' OR manufacturer LIKE '%search%' OR unionName LIKE '%search%'").execute()
                return jsonify(model_to_dict(product))

        product_list = []
        for product in Product.select().order_by(Product.id):
            product_list.append(model_to_dict(product))
        return jsonify(product_list)

    if request.method == 'POST':
        new_product = dict_to_model(Product, request.get_json())
        new_product.save()
        return jsonify(model_to_dict(new_product))

    if request.method == 'PUT':
        body = request.get_json()
        Product.update(body).where(Product.id == id).execute()
        updated_product = Product.get_by_id(id)
        return jsonify(model_to_dict(updated_product))

    if request.method == 'DELETE':
        Product.delete_by_id(id)
        return f'Product {id} was deleted'


@app.route('/unions/', methods=['GET', 'POST'])
@app.route('/unions/<search>', methods=['GET'])
@app.route('/unions/<id>', methods=['PUT', 'DELETE'])
def union(id=None, search=None):
    if request.method == 'GET':
        if search:
            if math.isnan(search) == False:
                union = Union.select().where(phone=search).execute()
                return jsonify(model_to_dict(union))
            elif math.isnan(search) == False and len(search) < 9:
                union = Union.select_by_id(search)
                return jsonify(model_to_dict(union))
            else:
                union = Union.select().where(
                    "properName LIKE '%search%' OR nickName LIKE '%search%' OR industry LIKE '%search%'").execute()
                return jsonify(model_to_dict(union))

        union_list = []
        for union in Union.select().order_by(Union.id):
            union_list.append(model_to_dict(union))
        return jsonify(union_list)

    if request.method == 'POST':
        new_union = dict_to_model(Union, request.get_json())
        new_union.save()
        return jsonify(model_to_dict(new_union))

    if request.method == 'PUT':
        body = request.get_json()
        Union.update(body).where(Union.id == id).execute()
        updated_union = Union.get_by_id(id)
        return jsonify(model_to_dict(updated_union))

    if request.method == 'DELETE':
        Union.delete_by_id(id)
        return f'Union {id} was deleted'


@app.route('/users/', methods=['GET', 'POST'])
@app.route('/users/<search>', methods=['GET'])
@app.route('/users/<id>', methods=['PUT', 'DELETE'])
def user(id=None, search=None):
    if request.method == 'GET':
        if search:
            if math.isnan(search) == False:
                user = User.select_by_id(search)
                return jsonify(model_to_dict(user))
            else:
                user = User.select().where(userName=search).execute()
                return jsonify(model_to_dict(user))

        user_list = []
        for user in User.select().order_by(User.id):
            user_list.append(model_to_dict(user))
        return jsonify(user_list)

    if request.method == 'POST':
        new_user = dict_to_model(User, request.get_json())
        new_user.save()
        return jsonify(model_to_dict(new_user))

    if request.method == 'PUT':
        body = request.get_json()
        User.update(body).where(User.id == id).execute()
        updated_user = User.get_by_id(id)
        return jsonify(model_to_dict(updated_user))

    if request.method == 'DELETE':
        User.delete_by_id(id)
        return f'User {id} was deleted'


# @app.route('/scanner/<barcode>', methods=['GET'])
# def scanner(barcode):
#     url = f'https://cors-proxy-k7a5pa4az44r.runkit.sh/api.barcodelookup.com/v3/products?barcode={barcode}&formatted=y&key='.format(
#         os.environ.get("BARCODE_KEY"))

#     response = urllib.request.urlopen(url)
#     data = response.read()
#     # dict = json.loads(data)
#     product = dict_to_model(Product, data)

#     return jsonify(model_to_dict(product))


app.run(debug=True)
