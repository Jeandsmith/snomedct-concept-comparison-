from flask import Flask, render_template, request, redirect
import itertools as it
# import db_requests as dbreq
# import threading

app = Flask(__name__, static_folder='public/')

# Only handle GET requests
@app.route('/')
def home():
    return render_template('main.html')


@app.route('/term-search')
def term_search():

    # Get the searched terms
    # t1 = request.args['search']
 
    print(request.args)
    # terms = dbreq.get_terms(t1)
    terms = []
    return render_template('main_res.html', terms=terms)


# cursor.close()
# connection.close()
