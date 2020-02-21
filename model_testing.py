from gensim.models import KeyedVectors
import time
# import nltk
import psycopg2 as psql

# model = api.load('../')
# model = KeyedVectors.load_word2vec_format('../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
# fs = pd.read_csv('../pubmed/hamulus.txt', sep='\t')
# documents = fs[:].values
# single_doc = [ nltk.word_tokenize(word[0]) for word in documents]

st = time.time()

# print(model.wv.similarity('tori', 'humular'))
nd = time.time()

print("Time: " + str(nd - st))