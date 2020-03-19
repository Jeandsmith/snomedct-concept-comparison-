from gensim.models import KeyedVectors as kv
from nltk.corpus import stopwords

model = None
st = []

def load_models():
	"""Load the pre-trained model
	
	load_model(None) -> Load the pre-trained model from file.
	"""
	global model
	global st
	# Load the already trained model
	model = kv.load_word2vec_format(
		'../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
	print(len(model.wv.vocab))
	# Getting the list of current stop words maintained by nltk
	st = stopwords.words("english")

# 
def sim(str1, str2):
	# Clean/remove the stop words from the search
	sp_str1 = [word for word in str1.lower().split(' ') if word not in st]
	sp_str2 = [word for word in str2.lower().split(' ') if word not in st]
	# Make the comparisons.
	# try:
	# 	return model.wv.n_similarity(sp_str1, sp_str2)
	# except KeyError as ke:
	# 	return 0.0
	# First let me see how does this look
	print(f'String 1: {sp_str1}')
	print(f'String 2: {sp_str2}')
	# Return a bluf value 
	return 0.0

# Generate the similiarities and return
def gen_sim(data, user_input):

	res = list()

	# Process each row/tuple of data
	for tup in data:
		(term, concept_id,) = tup
		res.append({
				'term': term,
				'concepId': concept_id,
				'similarity': str(sim(term, user_input))
		})

	return res
