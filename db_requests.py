import psycopg2 as pg
# import time

connection = pg.connect("dbname=snomed user=postgres password=root")
connection.autocommit = False
cursor = connection.cursor()

# Get filtered terms of a query


def filtered_terms(tag, query):
    res = get_terms(query, tag)
    # print(res)
    return res


def ts_query(query):
    """
        Preprocess the query
    """

    # Place an & token for indexing queries
    if ' ' in query and not query.endswith(' '):
        return query.replace(' ', ' & ')
    else:
        return query

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

    t = ts_query(q)

    #   Postgresql handles indexing and queries
    # conceptId
    if not tt:
        query = '''
            SELECT DISTINCT c.id, d.term, tag
            FROM
                sct2_concept AS c,
                sct2_description AS d,
                sct2_sem_tag AS st,
                to_tsquery(%(search)s) AS q
            WHERE
                st.id = d.id AND
                c.id = d.conceptId AND
                d.concept @@ q AND
                d.active = '1' AND
                c.active = '1';
        '''

        try:
            cursor.execute(query, {'search': t})
        except:
            connection.rollback()
            return []
    else:

        # Clean white space at both ends of the string
        tt = tt.strip()

        if tt == "No tag":
            tt = "0"

        query = '''
            SELECT DISTINCT c.id, d.term, tag
            FROM 
                sct2_concept AS c, 
                sct2_description AS d,
                sct2_sem_tag AS st, 
                to_tsquery(%(search)s) AS q
            WHERE 
                st.id = d.id AND
                c.id = d.conceptId AND
                d.concept @@ q AND 
                c.active = '1' AND
                d.active = '1' AND
                st.tag_idx @@ to_tsquery(%(tag)s);
            '''

        tt = ts_query(tt)
        cursor.execute(query, {'search': t, 'tag': tt})

    # Fetch all results.
    ans = cursor.fetchall()

    # Send them away
    return ans


def get_alt_terms(conceptId):
    if not conceptId:
        return []

    query = '''
        SELECT DISTINCT c.id, d.term, d.typeid
            FROM 
                sct2_concept AS c, 
                sct2_description AS d
            WHERE 
                c.id = d.conceptId AND
                c.active = '1' AND 
                d.active = '1' AND
                d.conceptId = %(conceptId)s;
    '''

    cursor.execute(query, {'conceptId': conceptId})
    ans = cursor.fetchall()
    return ans


# Post some feedback on the terms
def postFeedback(feedback, conceptid):
    query = """
    
    INSERT INTO user_feedback VALUES (%(conceptId)s, %(feedback)s, CURRENT_DATE);
    
    """

    cursor.execute(query, {'feedback': feedback, 'conceptId': conceptid})
    connection.commit()

# Get the count of user feedback for a concept
def feedbackCount (conceptId):
    cursor.execute('SELECT * FROM user_feedback WHERE conceptId = %(conceptId)s', {'conceptId': conceptId})
    count = cursor.fetchall()
    return count