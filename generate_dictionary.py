from gensim.corpora import Dictionary, MmCorpus
from gensim.similarities import SparseTermSimilarityMatrix, SparseMatrixSimilarity, Similarity, SoftCosineSimilarity
from gensim.matutils import softcossim
from gensim.models import KeyedVectors, WordEmbeddingSimilarityIndex, TfidfModel, LsiModel

# from gensim.utils import simple_preprocess
# import pandas as pd

# # Package that add a progress bar
from tqdm import tqdm
from nltk import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import WordNetLemmatizer
# import os
import logging
# from gensim.models.phrases import Phrases
# from gensim.utils import simple_preprocess
# import pickle
# import re
# import string

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# # Save the dictionary tp be used on main program
resource_folder = 'resources/'

# Pandas Dataframe
# df = pd.read_csv(
#     '../snomed-files/sct2_Description_Full-en_US1000124_20190901.txt', sep='\t', header="infer")

# # Get the terms
# st = set(stopwords.words('english'))

# print('Dropping empty rows')
# df['term'].dropna(inplace=True)

# docs = df['term']

# print('Converting to lower')
# lower_docs = [doc.lower() for doc in tqdm(docs)]

# print('removing numbers')
# no_num_docs = [re.sub(r'\d+', '', doc) for doc in tqdm(lower_docs)]

# print('Removing punctuations')
# no_puct_docs = [re.sub(r'[!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]+', '', doc) for doc in tqdm(no_num_docs)]

# print('Removing white spaces')
# no_wt_doc = [doc.strip() for doc in tqdm(no_puct_docs)]

# # Tokinizing
# print("Tokinizing")
# doc_token = [[word for word in word_tokenize(doc) if word not in st] for doc in tqdm(no_wt_doc)]

# # Lexing
# print("lexing")
# lem = WordNetLemmatizer()
# lex_docs = [[lem.lemmatize(word) for word in doc] for doc in tqdm(doc_token)]

# # Save the objects
# print('Saving list objects')
# pickle.dump(doc_token, open(f'{resource_folder}docs.p', 'wb'))
# pickle.dump(lex_docs,  open(f'{resource_folder}lex_docs.p', 'wb'))

# doc_token = pickle.load(open(f'{resource_folder}docs.p', 'rb'))

# dictionary = Dictionary(doc_token)

# print(f'Saving Dictionary to {resource_folder}')
# dictionary.save(f'{resource_folder}dict.mm')

# doc_token = pickle.load(open(f'{resource_folder}docs.p', 'rb'))

# dictionary = Dictionary(doc_token)
# dictionary.save(f'{resource_folder}dict.dict')

# # Bigram (2 words)
# bigram = Phrases(doc_token, min_count=3, threshold=10.0)

# # Trigram
# trigram = Phrases(bigram[doc_token], threshold=10)

# # # Update dict
# dictionary.add_documents(bigram[doc_token])
# dictionary.add_documents(trigram[bigram[doc_token]])
# dictionary.save(f'{resource_folder}dict.dict')

dictionary = Dictionary.load(f'{resource_folder}dict.mm')

# Current model
# model = KeyedVectors.load_word2vec_format(
#     '../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)

# # # Use cosine similarity as index for future queries
# similarity_index = WordEmbeddingSimilarityIndex(model)
# similarity_index.save(f'{resource_folder}sim_index.mm')
# similarity_index = WordEmbeddingSimilarityIndex.load(f'{resource_folder}sim_index.mm')

# # # Create similarity matrix
# similarity_matrix = SparseTermSimilarityMatrix(similarity_index, dictionary, tfidf=None, nonzero_limit=100)
# similarity_matrix.save(f'{resource_folder}sim_mat.mm')
similarity_matrix = SparseTermSimilarityMatrix.load(f'{resource_folder}sim_mat.mm')

# # # Simple test query mapped to tfid weighted space
test_query = dictionary.doc2bow(word_tokenize("Heart".lower()), allow_update=True)

documents = [
    'Heart',
    'Heartburn',
    'Heart beat'
]

bow_corpus = [dictionary.doc2bow(word_tokenize(document.lower())) for document in tqdm(documents)]

c_index = Similarity(output_prefix=None, corpus=bow_corpus, num_features=len(dictionary))
c_2 = Similarity(output_prefix=None, corpus=bow_corpus, num_features=len(dictionary))
sp_index = SparseMatrixSimilarity(bow_corpus, num_features=len(dictionary))
soft = SoftCosineSimilarity(bow_corpus, similarity_matrix, chunksize=256)

c_res = c_index[test_query]
c_res_2 = c_2[test_query]
sp_res = sp_index[test_query]
softq = soft[test_query]

print(f'c_res = {c_res}')
print(f'c_res_2 = {c_res_2}')
print(f'sp_res = {sp_res}')
print(f'Soft = {softq}')
