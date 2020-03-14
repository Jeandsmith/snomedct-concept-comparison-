from flask import Flask, render_template, request, redirect, url_for, jsonify
import itertools as it
import db_requests as dbreq
from time import sleep
from flask_script import Server, Manager
import gens

# Custom server to load data at server startup
class MyServer(Server):
    def __call__(self, app, *args, **kargs):

        # Load the w2v model
        gens.load_models()

        return Server.__call__(self, app, *args, **kargs)

app = Flask(__name__, static_folder='public/')
manager = Manager(app)
manager.add_command('runserver', MyServer)

# Handle home page
@app.route('/')
def home():
    return render_template('main.html')

# Handles user requests 
@app.route('/term-search', methods=["GET", "POST"])
def term_search():
    # Handle post request
    if request.method == 'GET':
        t1 = request.args.get('search')
        ans = dbreq.get_terms(t1)
        res = gens.gen_sim(ans, t1) 
        return jsonify(results)


if __name__ == "__main__":
    manager.run()