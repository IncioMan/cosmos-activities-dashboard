import pytest
from lambda_function import lambda_handler
import json

@pytest.mark.parametrize(
    ("message_file", "object_key"), [
    pytest.param('messages/example_lambda/message1.json','files_to_notify/test1.csv', id="Test Case 1"),
    pytest.param('messages/example_lambda/message2.json', 'files_to_notify/test2.csv', id="Test Case 2")
])
def test_lambda_function(message_file, object_key):
    with open(message_file, 'r') as file:
        event_data = json.load(file)

    # Invoke the Lambda function
    result = lambda_handler(event_data, None)

    # Assert the expected outcome
    assert result['statusCode'] == 200
    assert object_key in result['body']