from gensim.utils import simple_preprocess
from gensim.similarities import Similarity
from gensim.corpora import Dictionary
from gensim.models import TfidfModel, FastText
import pandas as pd

c1 = simple_preprocess(concept_1)
c2 = simple_preprocess(concept_2)
split_q = simple_preprocess(concept_1)
sims = ft.n_similarity(c1, c2)