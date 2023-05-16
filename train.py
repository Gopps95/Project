import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer

import tensorflow
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Dropout
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.models import load_model

lemmatizer = WordNetLemmatizer()

intents = json.loads(open('C:/Users/Asus/OneDrive/Desktop/CollegeProject/Project/dev_light.json').read())

words = []
classes = []
documents = []
ignore_letters = ['?', '!', '.', ',', '\n', '\t']

for intent in intents:
    for pattern in intent['patterns']:
        word_list = nltk.word_tokenize(pattern)
        words.extend(word_list)
        documents.append((word_list, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

print(documents)
