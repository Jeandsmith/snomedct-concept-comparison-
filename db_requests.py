import psycopg2 as pg
from gensim.models import KeyedVectors as kv

connection = pg.connect("dbname=snomed user=postgres password=root")
cursor = connection.cursor()

model = kv.load_word2vec_format(
    '../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
# print(len(model.wv.vocab))


def cal_sim(terms, searched_term):
    ts = searched_term.lower().split(' ')
    scores = list()

    for term in terms:
        t = term.lower().split(' ')
        scores.append(model.wv.n_similarity(ts, t))

    terms_and_scores = {'terms': terms, 'scores': scores}
    return terms_and_scores

# Get the result of a query
def get_terms(q):

    # If the input is empty
    if not q:
        return []

    t = "".join(["%", q, "%"])

    query = '''
        select term
        from description
        where active = '1' 
        and typeid like '%%3009%%' 
        and term like %(search)s
        limit 10;
    '''
    cursor.execute(query, {'search': t})
    ans = cursor.fetchall()
    results = list()

# Unpack the tupples
    for tup in ans:
        (unt,) = tup
        results.append(unt)

    rw = cal_sim(results, q)

    # print(results)
    return rw
