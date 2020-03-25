from gensim.corpora import Dictionary
from gensim.utils import simple_preprocess
import pandas as pd
# Package that add a progress bar
from tqdm import tqdm, trange
from nltk import word_tokenize
from nltk.corpus import stopwords
import os
import logging
from gensim.models import KeyedVectors, WordEmbeddingSimilarityIndex, TfidfModel
from gensim.matutils import softcossim
from gensim.utils import simple_preprocess
from gensim.similarities import SparseTermSimilarityMatrix, SoftCosineSimilarity, MatrixSimilarity

logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

"""
    This script is to generate the dictionary needed for the mapping 
    of corpus documents.
"""
# Pandas Dataframe
# df = pd.read_csv(
#     '../snomed-files/sct2_Description_Full-en_US1000124_20190901.txt', sep='\t', header="infer")
# # Get the terms
# df['term'].dropna(inplace=True)
# doc_token = df['term'].apply(word_tokenize) 
# dictionary = Dictionary(doc_token)
# # Save the dictionary tp be used on main program
resource_folder = 'resources/'

# print(f'Saving Dictionary to {resource_folder}')
# dictionary.save(f'{resource_folder}dict.mm')
documents = [
    "Heart Attack",
    "Fear of heart attack",
    "Able to use palmar grip (finding)",
    "Unable to use palmar grip (finding)",
    "Cardiac Infartion",
    "Having fear of a heart attack"]

# Testing library
dictionary = Dictionary.load('resources/dict.mm')
model = KeyedVectors.load_word2vec_format(
    '../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)

# Generate the Term Frequency - Inverse Document Frequency measure
# tfid = TfidfModel(dictionary=dictionary)

# Save the model to save time later
# tfid.save(f'{resource_folder}tfidf.mm')

# load tfidf 
tfid = TfidfModel.load(f'{resource_folder}tfidf.mm')

# Use cosine similarity as index for future queries
# similarity_index = WordEmbeddingSimilarityIndex(model)
# similarity_index.save(f'{resource_folder}sim_index.mm')

# Create similarity matrix
# similarity_matrix = SparseTermSimilarityMatrix(
    # similarity_index, dictionary, tfid, nonzero_limit=100)
# similarity_matrix.save(f'{resource_folder}sim_mat.mm')

# Simple test query
test_query = tfid[dictionary.doc2bow(simple_preprocess("Heart Attack"), allow_update=True)]

# index
bow_corpus = tfid[[dictionary.doc2bow(simple_preprocess(document))for document in documents]]

# index = SoftCosineSimilarity(bow_corpus, similarity_matrix, chunksize=256)
# Calculate 
index = MatrixSimilarity(bow_corpus, num_features=len(dictionary))

# get similarity of query against docs
similarities = index[test_query]
print(f'Similarities = {similarities}')