from gensim.models import KeyedVectors as kv

model = None

# Load the trained model


def load_models():
	global model

	model = kv.load_word2vec_format(
		'../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
	print(len(model.wv.vocab))

	# A smaller vector model to do testing of algorithm
	# local_model = kv.load_word2vec_format(
	# 	'../PubMed-w2v.bin', binary=True)
	# model = local_model
	print(len(model.wv.vocab))

# 
def sim(str1, str2):

	from itertools import zip_longest

	sp_str1 = str1.lower().split(' ')
	sp_str2 = str2.lower().split(' ')

	try:
		return model.wv.n_similarity(sp_str1, sp_str2)
	except KeyError as ke:
		return 0.0

# Generate the similiarities and return
def gen_sim(data, user_input):

	res = list()

	# Process each row/tuple of data
	for tup in data:
		(term, concept_id,) = tup
		similarity = sim(term, user_input)
		res.append({
				'term': term,
				'concepId': concept_id,
				'similarity': str(similarity)
		})

	return res
