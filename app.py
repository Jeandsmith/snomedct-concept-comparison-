from flask import Flask, render_template, request, redirect, url_for, jsonify
import itertools as it
import db_requests as dbreq
from time import sleep
from flask_script import Server, Manager
# from gensim import Ke
# import threading

def load_models():
    model = kv.load_word2vec_format(
        '../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
    print(len(model.wv.vocab))

# Custom server to load data at server startup
class MyServer(Server):
    def __call__(self, app, *args, **kargs):
        load_models()
        return Server.__call__(self, app, *args, **kargs)

app = Flask(__name__, static_folder='public/')

# Handle home page
@app.route('/')
def home():
    return render_template('main.html')


@app.route('/term-search', methods=["GET", "POST"])
def term_search():
    # Handle post request
    if request.method == 'GET':
        t1 = request.args.get('search')
        results = dbreq.get_terms(t1)
        return jsonify(results)

# cursor.close()
# connection.close()
