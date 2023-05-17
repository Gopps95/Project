import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
import pandas as pd
from tensorflow.keras.models import load_model

lemmatizer = WordNetLemmatizer()
intents = json.loads(open(r'C:\Users\Asus\OneDrive\Desktop\CollegeProject\Project\intents.json').read())


words = pickle.load(open('words.pkl','rb'))
classes = pickle.load(open('classes.pkl','rb'))
model = load_model('chatbot_model.model')


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words] 
    return sentence_words

def bag_of_words(sentence):
    