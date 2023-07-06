import requests
import json

# API endpoint URL
url = "https://api.kujira.app/api/txs?q=kujira1ackqp55ygdmvx2armyl9x9k6d6pdrcj98l8u5u&limit=10&offset=0&order_by=rowid&order_dir=desc"

# Send a GET request to the API
response = requests.get(url)

def parse_tx(tx):
    time = tx['block']['created_at']
    print(f"Time: {time}")
    hash = tx['hash']
    print(f"Hash: {hash}")
    for event in tx['events']:
        if(event['type'] == 'transfer'):
            for attr in event['attributes']:
                if(attr['key']=='recipient'):
                    print(f"Recipient: {attr['value']}")
                if(attr['key']=='amount'):
                    print(f"Amount: {attr['value']}")
                if(attr['key']=='sender'):
                    print(f"Sender: {attr['value']}")

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Retrieve the JSON data
    print(len(response.json()['txs']))
    json_data = response.json()

    for tx in response.json()['txs']:
        # Call the parse_json function to parse the JSON data
        parse_tx(tx)

else:
    # Handle any errors that occurred during the request
    print("Error:", response.status_code)
