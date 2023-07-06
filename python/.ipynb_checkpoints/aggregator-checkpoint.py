import requests
import json
import pandas as pd
import time

address = 'kujira1pkmjc7p7lqg6m3nm7csde88pnpad945kla5hyu'
print(pd.read_csv(f'data/{address}.csv').groupby(['sender','recipient','valuta']).sum())