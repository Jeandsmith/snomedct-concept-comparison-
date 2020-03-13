from gensim.models import KeyedVectors as kv

# Model on mem
model = None

# Load the trained model
def load_models():
    model = kv.load_word2vec_format(
        '../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
    print(len(model.wv.vocab))

# Generate the similiarities and return
def gen_sim(data):
    pass