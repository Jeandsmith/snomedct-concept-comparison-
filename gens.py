# Import Keyvector to load pre-trained model
from gensim.models import KeyedVectors as kv
# Import to generate the index of embedded words trough similarity
from gensim.models import WordEmbeddingSimilarityIndex
# Import for the generation of BOW corpus with weighted word count
from gensim.models import TfidfModel
# Import for simple prepocessing of the documents by coverting to lowercased tokens
from gensim.utils import simple_preprocess
# Import for the calculation of the soft cosine similarity against a corpus
from gensim.similarities import MatrixSimilarity
# Import for the generation of a dictionary which maps each token in a document to an unique ID
from gensim.corpora import Dictionary
import pandas as pd
import logging
logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# Path to resources
res_path = 'resources/'
# Declare the model
model = None
# load tfif for bow_corpus weighting
tfid = None
# Load dict
dictionary = None

# Just load some resources at server startup


def load_models():
    """Load the pre-trained model

    load_model(None) -> Load the pre-trained model from file.
    """
    # Define the needed vars to be global
    global model
    global tfid
    global dictionary
    # TODO : Load the made dictionary
    tfid = TfidfModel.load(f'{res_path}tfidf.mm')
    # Load predfined divtionary
    dictionary = Dictionary.load(f'{res_path}dict.mm')
    # Load the already trained model
    model = kv.load_word2vec_format(
        '../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)

# Generate the similiarities and return


def gen_sim(documents, query):
    # Convert the query result from a list of tuples to pandas DataFrame(Rows and Columns)
    df = pd.DataFrame(documents, columns=["Term"])
    # Make copy of terms to work with after dropping empty values
    df["Term"].dropna(inplace=True)
    docs = df['Term'].values
    # Convert the terms to a list of corpus (corpora) (id: word)
    bow_corpus = tfid[[dictionary.doc2bow(
        simple_preprocess(doc)) for doc in docs]]
    # Generate the sim matrix against corpus using already embedded words
    matrix_sim_index = MatrixSimilarity(
        bow_corpus, num_features=len(dictionary))
    # Conver query to a corpus
    print(f'{query} -- From gen.py')
    q = tfid[dictionary.doc2bow(simple_preprocess(query), allow_update=True)]
    # # Get the similarities
    print(f'{q} -- Query as corpus')
    sims = matrix_sim_index[q]
    # loc (location): index of insertion
    # value: value col to be inserted
    # column: Column header
    # Insert back to the DF the sim column
    (h, w) = df.shape
    df.insert(loc=w, value=sims, column="Similarities")
    # Sort the values by similarity to query descending
    df.sort_values(by=['Term', "Similarities"], ascending=False, inplace=True)
    # # Export as records ([{Term, ID, Sim}, {Term, ID, Sim}])
    res = df.to_dict('records')
    # print(res)
    return res
