import psycopg2 as pg
# import time

connection = pg.connect("dbname=snomed user=postgres password=root")
cursor = connection.cursor()

# Get filtered terms of a query


def filtered_terms(tag, query):
    res = get_terms(query, tag)
    # print(res)
    return res


# Get the result of a query
def get_terms(q, *argv):

    if not q:
        return []

    # Process the query
    t = ''
    tt = None

    # getting the tag
    for arg in argv:
        tt = arg

    # Place an & token for indexing queries
    if ' ' in q and not q.endswith(' '):
        t = q.replace(' ', ' & ')
    else:
        t = q
        # print(t)

    #   Postgresql handles indexing and queries
    # conceptId
    if not tt:
        query = '''
        SELECT distinct term, tag
        FROM searchable_terms as st, to_tsquery(%(search)s) as q
        WHERE st.searchable_term_index @@ q;
        '''

        cursor.execute(query, {'search': t})
    else:

        # Clean white space at both ends of the string
        tt = tt.strip()

        if tt == "No tag":
            tt = "0"

        # if ' ' in tt:
        #     tt = tt.replace(' ', ' & ')

        # print(f"Tag: {tt}")
        # query = '''
        # SELECT distinct term, tag
        # FROM searchable_terms as st, to_tsquery(%(search)s) as q, to_tsquery(%(tag)s) as tt
        # WHERE st.searchable_term_index @@ q
        # AND st.searchable_tag_index @@ tt;
        # '''

        query = '''
        SELECT distinct term, tag
        FROM searchable_terms as st, to_tsquery(%(search)s) as q
        WHERE st.searchable_term_index @@ q
        AND tag = %(tag)s;
        '''

        cursor.execute(query, {'search': t, 'tag': tt})

    # Fetch all results.
    ans = cursor.fetchall()

    # Send them away
    return ans
