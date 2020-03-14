from gensim.models import KeyedVectors as kv

# Model on mem
model = None

# Load the trained model
def load_models():
	model = kv.load_word2vec_format(
		'../wikipedia-pubmed-and-PMC-w2v.bin', binary=True)
	print(len(model.wv.vocab))

# Generate the similiarities and return
def gen_sim(data, user_input):
	res = list()

	# Clean the user input if needed
	

	# Process each row/tuple of data
	for tup in data:
		(term, concept_id,) = tup
		res.append({
				'term': term,
				'concepId': concept_id,
				'similarity': model.wv.n_similarity(user_input.split(' '), term.split(' '))
			})

	return res