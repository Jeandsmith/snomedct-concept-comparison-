from gensim.utils import simple_preprocess
from gensim.similarities import Similarity
from gensim.corpora import Dictionary
from gensim.models import TfidfModel, FastText
from openpyxl import Workbook
import pandas as pd
# import logging

# logging.basicConfig(
#     format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

res_path = 'resources/'
dictionary = Dictionary.load(f'{res_path}dictionary.dict')
tfidf = TfidfModel.load('resources/tfidf/tfid.mm')