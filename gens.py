# Import Keyvector to load pre-trained model
from gensim.models import KeyedVectors as kv
# Import to generate the index of embedded words trough similarity
from gensim.models import WordEmbeddingSimilarityIndex
# Import for the generation of BOW corpus with weighted word count
from gensim.models import TfidfModel
# Import for simple prepocessing of the documents by coverting to lowercased tokens
from gensim.utils import simple_preprocess
# Import for the calculation of the soft cosine similarity against a corpus
from gensim.similarities import Similarity
# Import for the generation of a dictionary which maps each token in a document to an unique ID
from gensim.corpora import Dictionary
import pandas as pd
import logging
from nltk import word_tokenize
from numpy import round

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

res_path = 'resources/'
# model = None
# sim_index = None
# dictionary = None


def gen_sim(documents, query):

    # Load the dictionary
    dictionary = Dictionary.load(f'{res_path}dict.mm')

    # Convert the query result from a list of tuples to pandas DataFrame(Rows and Columns)
    df = pd.DataFrame(documents, columns=["Term", "Tag"])

    # Make copy of terms to work with after dropping empty values
    df["Term"].dropna(inplace=True)
    docs = df['Term'].values

    # Convert the terms to a list of corpus (corpora) (id: word)
    bow_corpus = [dictionary.doc2bow(
        word_tokenize(doc.lower())) for doc in docs]

    # Generate the sim matrix against corpus using already embedded words
    # Also, Similarity is scaleable
    index = Similarity(output_prefix=None, corpus=bow_corpus,
                       num_features=len(dictionary))

    # Conver query to a corpus
    print(f'{query} -- From gen.py')
    q = dictionary.doc2bow(word_tokenize(query.lower()), allow_update=True)

    # Get the similarities
    print(f'{q} -- Query as corpus')
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
        # doc = [query.lower().split(' ')]
        # sims = index[q]
        return []
