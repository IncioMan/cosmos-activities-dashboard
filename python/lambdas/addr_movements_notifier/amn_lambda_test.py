import pytest
from lambda_function import lambda_handler
import json

@pytest.mark.parametrize(
    ("message_file"), [
    pytest.param('messages/token_trades_notifier/2_buy_astro.json',id="Buy ASTRO")
])
def test_lambda_function(message_file):
    with open(message_file, 'r') as file:
        event_data = json.load(file)

    # Invoke the Lambda function
    result = lambda_handler(event_data, None)

    # Assert the expected outcome
    assert result['statusCode'] == 200