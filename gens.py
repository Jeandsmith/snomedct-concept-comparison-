from gensim.utils import simple_preprocess
from gensim.similarities import Similarity
from gensim.corpora import Dictionary
from gensim.models import TfidfModel, FastText
from openpyxl import Workbook
import pandas as pd
# import numpy as np
# import logging

# logging.basicConfig(
#     format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

res_path = 'resources/'
dictionary = Dictionary.load(f'{res_path}dictionary.dict')
tfidf = TfidfModel.load('resources/tfidf/tfid.mm')
ft = FastText.load('resources/ft_model.mm')

def gen_query_term_sim(comparison_terms, term):
    df = pd.DataFrame(comparison_terms, columns=["conceptId", "Term", "Tag"])
    return tfidf_sim(concept_1=term, df=df)

def tfidf_sim(concept_1, df):

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
    global tfidf
    index = Similarity(output_prefix=None, corpus=tfidf[bow_corpus],
                       num_features=len(dictionary))

    # Conver concept_1 to a corpus
    q = tfidf[dictionary.doc2bow(simple_preprocess(concept_1))]

    # Get the similarities
    try:
        sims = index[q]

        # loc (location): index of insertion
        # value: value col to be inserted
        # column: Column header
        # Insert back to the DF the sim column
        (h, w) = df.shape
        df.insert(loc=w, value=sims, column="Similarities")
     
        # wb = Workbook()
        # ws = wb.active()
        # ws.append(df)
        # wb.save('data.xlsx')

        # Sort the values by similarity to concept_1 descending
        # df.sort_values(by=['Term', "Similarities"], ascending=False, inplace=True)
        # # Export as records ([{Term, ID, Sim}, {Term, ID, Sim}])
        res = df.to_dict('records')

        # print(res)
        return res
    except:
        return []


def fasttext_sim(concept_1, concept_2):
    c1 = simple_preprocess(concept_1)
    c2 = simple_preprocess(concept_2)
    sims = ft.n_similarity(c1, c2)
    return sims

def compare_concepts(concept_1, concept_2):
    return fasttext_sim(concept_1, concept_2)
