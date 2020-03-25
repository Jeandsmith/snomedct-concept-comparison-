import psycopg2 as pg
# import time

connection = pg.connect("dbname=snomed user=postgres password=root")
cursor = connection.cursor()

# Get the result of a query

def get_terms(q):

    # If the input is empty
    if not q:
        return []

    # Process the query
    t = ''

    if ' ' in q and not q.endswith((' ')):
        t = q.replace(' ', ' & ')
    else:
        t = q
        print(t)

    #   Postgresql handles indexing and queries
    # conceptId
    query = '''
        SELECT distinct term
        FROM description, to_tsquery(%(search)s) as query
        WHERE term_idx @@ query;
    '''

    cursor.execute(query, {'search': t})
    ans = cursor.fetchall()
    return ans
