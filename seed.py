from flask import Flask, request, jsonify
from peewee import *
from playhouse.shortcuts import model_to_dict, dict_to_model

db = PostgresqlDatabase(
    'buyU',
    user='postgres',
    password='',
    host='localhost',
    port=5432
)

db.connect()
db.drop_tables([Product], [Union], [User])
db.create_tables([Product], [Union], [User])