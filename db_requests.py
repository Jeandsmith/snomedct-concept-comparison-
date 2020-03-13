import psycopg2 as pg
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
        SELECT distinct term, conceptId
        FROM description, to_tsquery(%(search)s) as query 
        WHERE term_idx @@ query;
    '''

    cursor.execute(query, {'search': t})
    ans = cursor.fetchall()
    results = []

# Unpack the tupples
    for tup in ans:
        (term, concept_id,) = tup
        # sim_score

        results.append({
            'term': term,
            'concepId': concept_id,
            'similarity': 0
        })

    return results
