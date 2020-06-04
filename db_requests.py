import psycopg2 as pg
import pandas as pd
import re
# import time

connection = pg.connect("dbname=snomed user=postgres password=root")
connection.autocommit = False
cursor = connection.cursor()

# Get filtered terms of a query


def filter_terms(tag, query):
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
            SELECT DISTINCT d.conceptId, d.term, tag
            FROM
                sct2_concept AS c,
                sct2_description AS d,
                sct2_relationship as r,
                sct2_sem_tag AS st,
                to_tsquery(%(search)s) AS q
            WHERE
                st.id = d.id AND
                c.id = d.conceptId AND
                d.conceptId = r.sourceId AND
                c.active = '1' AND
                d.active = '1' AND
                r.active = '1' AND
                concept @@ q;
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
            SELECT DISTINCT d.conceptId, d.term, tag
            FROM 
                sct2_concept AS c, 
                sct2_description AS d,
                sct2_relationship AS r,
                sct2_sem_tag AS st, 
                to_tsquery(%(search)s) AS q
            WHERE 
                st.id = d.id                AND
                c.id = d.conceptId          AND
                d.concept @@ q              AND 
                c.active = '1'              AND
                d.active = '1'              AND
                r.active = '1'              AND
                r.sourceId = d.conceptId    AND 
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
    df = pd.DataFrame(ans, columns=["conceptId", "Term", "Typeid"])
    ans = df.to_dict('records')
    return ans


# Post some feedback on the terms
def postFeedback(data):
    
    data_dict = dict(data)

    query = """
    
    INSERT INTO user_feedback VALUES (%(conceptId)s, %(feedback)s, CURRENT_TIMESTAMP, %{user_name}s, %{email}s);
    
    """

    cursor.execute(query, {
        'feedback': data_dict.feedback, 
        'conceptId': data_dict.conceptId,
        'email': data_dict.email,
        'user_name': data_dict.username})
    connection.commit()
    # print(dict(data))

# Get the count of user feedback for a concept


def feedbackCount(conceptId):
    cursor.execute(
        'SELECT * FROM user_feedback WHERE conceptId = %(conceptId)s', {'conceptId': conceptId})
    count = cursor.fetchall()
    return count

# Get concept relationships


def get_concept_rels(conceptId):
    query = '''
        SELECT * FROM sct2_concept_attr_rels
	    WHERE conceptId = %(conceptId)s;'''
    cursor.execute(query, {'conceptId': conceptId})
    data = cursor.fetchall()
    c_data = clean_text(data)
    return c_data


def clean_text(data):
    d = pd.DataFrame(data, columns=['conceptId', 'typeTerm', 'destTerm'])
    res = list()

    for row in d.values:
        typeT = re.sub(r'\s\((\w|\W)*\)', '', row[1], flags=re.IGNORECASE)
        desT = re.sub(r'\s\((\w|\W)*\)', '', row[2], flags=re.IGNORECASE)
        res.append([row[0], typeT, desT])

    df_res = pd.DataFrame(res, columns=['conceptId', 'typeTerm', 'destTerm'])
    df_res.drop_duplicates(inplace=True)
    fn = df_res.to_dict('records')
    return fn
