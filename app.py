from flask import Flask, render_template, request, redirect
import psycopg2 as pg
from gensim.models import KeyedVectors as kv

# print("Loading models.")
# model = kv.load_word2vec_format('../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
# print("Model loading done.")

connection = pg.connect("dbname=snomed user=postgres password=root")
cursor = connection.cursor()

def get_terms(query):
    query = '''
        select term
        from description
        where active = '1' 
        and typeid like '%%3001%%' 
        and term like %(search)s
        limit 5;
    '''
    cursor.execute(query, {'search': query})
    ans = cursor.fetchall()
    results = list()

# Unack the tupples
    for tup in ans:
        (unt,) = tup
        results.append(unt)

    print(results)
    return results


app = Flask(__name__, static_folder='public/')

# Only handle GET requests
@app.route('/')
def home():
    return render_template('main.html')


@app.route('/term-searh')
def term_search():

    # Get the searched terms
    t1 = "".join(["%", request.args['term1'], "%"])
    t2 = "".join(["%", request.args['term2'], "%"])

    term_res_1 = get_terms(t1)
    term_res_2 = get_terms(t2)
    return render_template('main_res.html', terms=[term_res_1, term_res_2])


# cursor.close()
# connection.close()
