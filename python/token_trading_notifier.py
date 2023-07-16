#!/usr/bin/env python
# coding: utf-8

# In[300]:


import requests
import json
import pandas as pd
import time
import re
import urllib
import matplotlib
import numpy as np
pd.set_option('display.max_colwidth', None)


# In[301]:


try:
    log = pd.read_csv("./notifier_logging.csv")
except Exception as e:
    print(f"No file yet {e}")
    log = None


# In[302]:


"""
pipenv run jupyter nbconvert --to python token_trading_notifier.ipynb
"""
"""
pipenv run python token_trading_notifier.py --address "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6" --token_name "ASTRO" --varReturnAsset 'axlUSDC' --thresholdReturnAmount 1000 --notifier_id 1
"""
"""
pipenv run python token_trading_notifier.py --address "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6" --token_name "ASTRO" --checkOfferAsset --varOfferAsset 'axlUSDC' --thresholdOfferAmount 1000 --notifier_id 2
"""
"""
pipenv run python token_trading_notifier.py --address "kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867" --token_name "KUJI" --varReturnAsset 'axlUSDC' --thresholdReturnAmount 1000 --notifier_id 3
"""
"""
pipenv run python token_trading_notifier.py --address "kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867" --token_name "KUJI" --checkOfferAsset --varOfferAsset 'axlUSDC' --thresholdOfferAmount 1000 --notifier_id 4
"""


# In[303]:


import argparse

# Create an argument parser
parser = argparse.ArgumentParser()

# Add named arguments
parser.add_argument('--address', type=str, help='The address value')
parser.add_argument('--token_name', type=str, help='The token name')
parser.add_argument('--checkOfferAsset', action='store_true', help='Check offer asset')
parser.add_argument('--varReturnAsset', type=str, help='The name for return asset')
parser.add_argument('--thresholdReturnAmount', type=float, help='The threshold return amount')
parser.add_argument('--varOfferAsset', type=str, help='The name for offer asset')
parser.add_argument('--thresholdOfferAmount', type=float, help='The threshold offer amount')
parser.add_argument('--notifier_id', type=int, help='The notifier ID')

# Parse the arguments
args = parser.parse_args()

# Assign the parsed argument values to variables
address = args.address
token_name = args.token_name
checkOfferAsset = args.checkOfferAsset
varReturnAsset = args.varReturnAsset
thresholdReturnAmount = args.thresholdReturnAmount
varOfferAsset = args.varOfferAsset
thresholdOfferAmount = args.thresholdOfferAmount
notifier_id = args.notifier_id


# In[304]:


"""
address = "kujira14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sl4e867"
token_name = "KUJI"
checkOfferAsset = False
varReturnAsset = 'axlUSDC'
thresholdReturnAmount = 100
notifier_id = 3
"""


# In[305]:


"""
address = "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6"
token_name = "ASTRO"
checkOfferAsset = False
varReturnAsset = 'axlUSDC'
thresholdReturnAmount = 100
notifier_id = 1
"""


# In[306]:


"""
address = "terra1w579ysjvpx7xxhckxewk8sykxz70gm48wpcuruenl29rhe6p6raslhj0m6"
token_name = "ASTRO"
checkOfferAsset = True
varOfferAsset = 'axlUSDC'
thresholdOfferAmount = 1000
notifier_id = 2
"""


# In[307]:


def get_txs_time_period(_from, _to):
    _df = None
    timestamp = urllib.parse.quote(_from.strftime("%Y-%m-%d+%H:%M:%S"),safe='+')
    while True:
        url = f"""
        https://api.seer.coinhall.org/api/coinhall/swaps/{address}?offset={timestamp}.010646870&limit=15
        """
        print(url)
        # Send a GET request to the API
        response = requests.get(url)
    
        time.sleep(1)
        print(f"Number of txs received: {len(response.json()['txs'])}")
        
        new_df = pd.DataFrame(response.json()['txs'])
        if _df is None:
            _df = new_df
        else:
            _df = pd.concat([_df, new_df])
        _df.timestamp = pd.to_datetime(_df.timestamp)
        min_ts = _df.timestamp.min()
        timestamp = urllib.parse.quote(min_ts.strftime("%Y-%m-%d+%H:%M:%S"),safe='+')

        if(min_ts.to_pydatetime().replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S") < _to.strftime("%Y-%m-%d %H:%M:%S")):
            break
    return _df


# In[308]:


from datetime import datetime, timedelta

current_date = datetime.now()
_log = pd.DataFrame([(notifier_id, (current_date - timedelta(hours=3)).strftime('%Y-%m-%d %H:%M:%S.%f'))], columns=['notifier_id','last_parsing_date'])
if log is None:
    log = _log
if not notifier_id in log['notifier_id'].tolist():
    log = pd.concat([log,_log])


# In[309]:


last_parsing_date = log[log.notifier_id == notifier_id].last_parsing_date.tolist()[0]
last_parsing_date = datetime.strptime(last_parsing_date, '%Y-%m-%d %H:%M:%S.%f')


# In[310]:


print(f"Filling the upper gap from {current_date.strftime('%Y-%m-%d %H:%M:%S')} to {last_parsing_date.strftime('%Y-%m-%d %H:%M:%S')}")
df = get_txs_time_period(current_date, last_parsing_date)


# In[311]:


from pytz import UTC
df = df[df.timestamp > pd.Timestamp(last_parsing_date, tz=UTC)]


# In[312]:


assets = {
    'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':'axlUSDC',
    'ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F':'axlUSDC',
    'terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26':'ASTRO'
}


# In[313]:


df = df.drop_duplicates(ignore_index=True)
df.returnAsset = df.returnAsset.replace(assets)
df.offerAsset = df.offerAsset.replace(assets)


# In[314]:


df['date'] = df.timestamp.apply(lambda x: x.strftime("%Y-%m-%d"))


# In[315]:


if(checkOfferAsset):
    txs_to_notify = df[(df.offerAmount > thresholdOfferAmount) & (df.offerAsset == varOfferAsset)]
else:
    txs_to_notify = df[(df.returnAmount > thresholdReturnAmount) & (df.returnAsset == varReturnAsset)]


# In[316]:


txs_to_notify


# In[317]:


messages = []
for i, row in txs_to_notify.iterrows():
    if(checkOfferAsset):
        messages.append(f"{row.traderAddress} has swapped {row.offerAmount} {row.offerAsset} for {token_name}")
    else:
        messages.append(f"{row.traderAddress} has swapped {token_name} for {row.returnAmount} {varReturnAsset}")


# In[318]:


bot_token = '6383968748:AAGKNNorLHvQ2edoLXfB3bTye9bu439htMM'


# In[319]:


messages


# In[320]:


def telegram_bot_sendtext(bot_message, bot_token, bot_chatID):
    
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + bot_message
    print(send_text)
    response = requests.get(send_text)

    return response.json()


# In[321]:


for message in messages:
    telegram_bot_sendtext(message, bot_token, "92383009")


# In[322]:


_last_parsing_date = df.timestamp.max().to_pydatetime().replace(tzinfo=None)
last_parsing_date = _last_parsing_date if len(df) > 0 else current_date


# In[323]:


log.loc[log.notifier_id == notifier_id, 'last_parsing_date'] = last_parsing_date


# In[324]:


log


# In[325]:


log.to_csv(f"./notifier_logging.csv", index=False)


# In[ ]:




