import requests
import json
import pandas as pd
import time

def parse_tx(tx):
    val_dict = {}
    val_dict['time'] = tx['block']['created_at']
    val_dict['hash'] = tx['hash']
    for event in tx['events']:
        if(event['type'] == 'transfer'):
            for attr in event['attributes']:
                if(attr['key'] in ['recipient','sender','amount']):
                    val_dict[attr['key']] = attr['value']
    return val_dict

df = None
i = 0
limit = 10
while True:
    # API endpoint URL
    address = 'kujira1pkmjc7p7lqg6m3nm7csde88pnpad945kla5hyu'
    url = f"https://api.kujira.app/api/txs?q={address}&limit={limit}&offset={i}&order_by=rowid&order_dir=desc"
    print(url)
    # Send a GET request to the API
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Retrieve the JSON data
        n_txs = len(response.json()['txs'])
        print(f"Received: {n_txs} txs")
        if(n_txs == 0):
            break

        json_data = response.json()

        vals = []
        for tx in response.json()['txs']:
            # Call the parse_json function to parse the JSON data
            vals.append(parse_tx(tx))
        if(df is None):
            df = pd.DataFrame(vals)
        else:
            df = pd.concat([df, pd.DataFrame(vals)])
        i += limit
        print(i)
        print(len(df))
    else:
        # Handle any errors that occurred during the request
        print("Error:", response.status_code)

df.to_csv(f'{address}.csv', index=False)
