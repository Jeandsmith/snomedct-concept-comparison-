import os
import pandas as pd
from nltk.corpus import stopwords
from nltk import tokenize
from nltk import download
from nltk import word_tokenize, sent_tokenize

# from scipy import spatial
from gensim.models import Word2Vec, KeyedVectors
from gensim.utils import simple_preprocess, open_file
# from sqlalchemy import create_engine
import numpy as np

print("Loading training data")
# Model training data set
training_set = pd.read_table(
    '/home/james/Documents/SnomedCT_USEditionRF2_PRODUCTION_20190901T120000Z/Full/Terminology/sct2_Description_Full-en_US1000124_20190901.txt')
# print(training_set.head(10))

terms = training_set['term'].values
# print(terms)

# download('stopwords')

print("Loading stop words")
# Load stopword list
stop_words = set(stopwords.words('english'))


print("Tokenizing training corpus")
# # tokenise each fsn (fully specified name) of the concepts
# # WORD_TOKENIZE(str) - Tokenize a document into substring 
term_tokens = [[word_tokenize(w) for w in ''.join(t)] for t in terms]

# print(term_tokens)

# Load neede data from database
# engine = create_engine("postgresql://sct:root@localHost:5432/snomed",
#                        client_encoding='utf8')

# pdb = pd.read_sql_table('concept', engine)
