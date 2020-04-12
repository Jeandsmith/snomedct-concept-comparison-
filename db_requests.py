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
            SELECT DISTINCT vs.search_term, tag, vs.conceptId
            FROM sct2_v_searchable AS vs, to_tsquery(%(search)s) as q, sct2_tag_s AS st
            WHERE 
	            idx_term @@ q AND
	            st.conceptId = vs.conceptId
        '''

        cursor.execute(query, {'search': t})
    else:

        # Clean white space at both ends of the string
        tt = tt.strip()

        if tt == "No tag":
            tt = "0"

        query = '''
            SELECT DISTINCT search_term, tag, vs.conceptId
            FROM sct2_v_searchable AS vs, to_tsquery(%(search)s) as q, sct2_tag_s AS st
            WHERE 
	        idx_term @@ q AND
	        st.conceptId = vs.conceptId AND
	        st.tag = %(tag)s;
            '''

        cursor.execute(query, {'search': t, 'tag': tt})

    # Fetch all results.
    ans = cursor.fetchall()

    # Send them away
    return ans

# Get the term synonyms and fsn


def get_alt_terms(conceptId):
    if not conceptId:
        return []

    query = '''
        SELECT DISTINCT search_term
        FROM sct2_v_searchable AS vs
        WHERE vs.conceptId = %(conceptId)s;
    '''

    cursor.execute(query, {'conceptId': conceptId})
    ans = cursor.fetchall()
    return ans

