import psycopg2 as pg
import pandas as pd
import re
# import time

connection = pg.connect("dbname=SNOMEDCT user=postgres password=root")
connection.autocommit = False
cursor = connection.cursor()

# Get filtered terms of a query


def filter_terms(tag, query):

    res = get_terms(query, tag)

    return res


def ts_query(query):

    query = query.strip()

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

    # Postgresql handles indexing and queries
    # conceptId
    if not tt:
        query = '''
            SELECT DISTINCT d.conceptId, d.term, tag
            FROM
                sct2_concept AS c,
                sct2_description AS d,
                sct2_relationship as r,
                sct2_tags AS st,
                to_tsquery(%(search)s) AS q
            WHERE
                st.conceptid = d.id AND
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
                sct2_tags AS st,
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

    query = """

    INSERT INTO user_feedback VALUES (%(conceptId)s, %(feedback)s, CURRENT_TIMESTAMP, %(user_name)s, %(email)s);

    """

    cursor.execute(query, {
        'feedback': data['feedback'],
        'conceptId': data['conceptId'],
        'email': data['email'],
        'user_name': data['username']})
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

    # Clean the data a bit
    data_table = pd.DataFrame(
        data, columns=['conceptId', 'typeTerm', 'destTerm'])
    data_table_processed = list()

    for row in data_table.values:
        typeT = re.sub(r'\s\((\w|\W)*\)', '', row[1], flags=re.IGNORECASE)
        desT = re.sub(r'\s\((\w|\W)*\)', '', row[2], flags=re.IGNORECASE)
        data_table_processed.append([row[0], typeT, desT])

    df_res = pd.DataFrame(data_table_processed, columns=[
                          'conceptId', 'typeTerm', 'destTerm'])
    df_res.drop_duplicates(inplace=True)
    fn = df_res.to_dict('records')

    return fn


def get_parent(conceptId):

    connection.rollback()
    try:
        cursor.execute('''
            select destterm
            from sct_concept_parents_childs
            where sourceid = %(conceptId)s;
        ''', {'conceptId': conceptId})
        parents = cursor.fetchall()
        df = pd.DataFrame(parents, columns=['Concept'])

        return pd.DataFrame(df.iloc[:, 0].str[:1], columns=['Concept']).to_dict('records')
    except pg.Error as e:
        print(e.diag.message_primary)
        return []

    # return pd.DataFrame(parents, columns=['Concept']).to_dict('records')


def get_children(conceptId):
    connection.rollback()
    try:

        cursor.execute('''
            select sourceterm
            from sct_concept_parents_childs
            where destinationid = %(conceptId)s;
        ''', {'conceptId': conceptId})
        data = cursor.fetchall()
        df = pd.DataFrame(data, columns=['Concept'])
        p = pd.DataFrame(df.iloc[:, 0].str[:], columns=['Concept']).to_dict('records')
        # print(p)

        return p
    except pg.Error as e:
        print(e.diag)
        return []
