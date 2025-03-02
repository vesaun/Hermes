from gensim.models import KeyedVectors
from gensim.test.utils import common_texts
from gensim.models import word2vec
from scipy import spatial
import numpy as np
import gensim.downloader
import os


model = gensim.downloader.load('word2vec-google-news-300')
