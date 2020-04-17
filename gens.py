from gensim.utils import simple_preprocess
from gensim.similarities import Similarity
from gensim.corpora import Dictionary
from gensim.models import LsiModel
import pandas as pd
# import logging

# logging.basicConfig(
#     format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

res_path = 'resources/'
dictionary = Dictionary.load(f'{res_path}dictionary.dict')
lsi = LsiModel.load(f'{res_path}lsi_model.mm')

def gen_query_term_sim(comparison_terms, term):
    df = pd.DataFrame(comparison_terms, columns=["conceptId", "Term", "Tag"])
    return gen_sim(query=term, df=df)

def gen_sym_sim(comparison_terms, term):
    df = pd.DataFrame(comparison_terms, columns=["conceptId", "Term"])
    return gen_sim(query=term, df=df)

def gen_sim(query, df):

    # Make copy of terms to work with after dropping empty values
    df["Term"].dropna(inplace=True)
    docs = df['Term'].values

    # Convert the terms to a list of corpus (corpora) (id: word)
    global dictionary
    bow_corpus = [dictionary.doc2bow(
        simple_preprocess(doc)) for doc in docs]

    # Generate the sim matrix against corpus using already embedded words
    # Also, Similarity is scaleable
    global dictionary
    global lsi
    index = Similarity(output_prefix=None, corpus=lsi[bow_corpus],
                       num_features=len(dictionary))

    # Conver query to a corpus
    q = lsi[dictionary.doc2bow(simple_preprocess(query), allow_update=True)]

    # Get the similarities
    try:
        sims = index[q]

        # loc (location): index of insertion
        # value: value col to be inserted
        # column: Column header
        # Insert back to the DF the sim column
        (h, w) = df.shape
        df.insert(loc=w, value=sims, column="Similarities")

        # Sort the values by similarity to query descending
        # df.sort_values(by=['Term', "Similarities"], ascending=False, inplace=True)
        # # Export as records ([{Term, ID, Sim}, {Term, ID, Sim}])
        res = df.to_dict('records')

        # print(res)
        return res
    except:
        return []


