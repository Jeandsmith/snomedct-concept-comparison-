import psycopg2 as pg
from gensim.models import KeyedVectors as kv
# import time

connection = pg.connect("dbname=snomed user=postgres password=root")
cursor = connection.cursor()

# Get the result of a query
def get_terms(q):

    # If the input is empty
    if not q:
        return []

    t = ''
    if ' ' in q and not q.endswith((' ')):
        t = q.replace(' ', ' & ')
    else:
        t = q

    print(t)

#   Postgresql handles indexing and queries
    query = '''
        SELECT distinct sct_terms, sctid 
        FROM sct_data_search
        WHERE searchable_index @@ to_tsquery(%(search)s)
        order by sct_terms desc
        limit 10;
    '''

    cursor.execute(query, {'search': t})
    ans = cursor.fetchall()
    results = []

# Unpack the tupples
    for tup in ans:
        (sct_term, sctid,) = tup
        # sim_score

        results.append({
            'sctid': sctid,
            'sct_term': sct_term,
            'similarity': 5
        })

    return results
