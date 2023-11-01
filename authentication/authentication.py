from flask import Flask, request, redirect, jsonify
import requests
import os
import base64
import json
from urllib.parse import urlencode

app = Flask(__name__)

client_id = '53a34fa4f504485bba992345c94f4d9c'  # Seu client_id
client_secret = '2fb3b48e963d456fb3e1be74e225a793'  # Seu secret
redirect_uri = 'http://127.0.0.1:8888/callback'  # Sua URI de redirecionamento

state_key = 'spotify_auth_state'

def generate_random_string(length):
    import random
    import string
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))

@app.route('/login')
def login():
    state = generate_random_string(16)
    response = redirect('https://accounts.spotify.com/authorize?' + \
                       f'response_type=code&client_id={client_id}&' + \
                       f'scope=user-library-modify playlist-modify-public&' + \
                       f'redirect_uri={redirect_uri}&state={state}')
    response.set_cookie(state_key, state)
    return response

@app.route('/callback')
def callback():
    code = request.args.get('code')
    state = request.args.get('state')
    stored_state = request.cookies.get(state_key)

    if state is None or state != stored_state:
        return jsonify({'error': 'state_mismatch'}), 400

    auth_options = {
        'url': 'https://accounts.spotify.com/api/token',
        'data': {
            'code': code,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        },
        'headers': {
            'Authorization': 'Basic ' + base64.b64encode((client_id + ":" + client_secret).encode("ascii")).decode("ascii")
        }
    }

    response = requests.post(auth_options['url'], data=auth_options['data'], headers=auth_options['headers'])
    data = response.json()

    if 'access_token' in data:
        access_token = data['access_token']
        refresh_token = data.get('refresh_token')

        options = {
            'url': 'https://api.spotify.com/v1/me',
            'headers': {'Authorization': 'Bearer ' + access_token}
        }

        response = requests.get(options['url'], headers=options['headers'])
        user_data = response.json()
        params = {
            'access_token': access_token,
            'refresh_token': refresh_token
        }

        query_string = urlencode(params)
        
        return redirect('http://localhost:3000/#' + query_string)
    else:
        return jsonify({'error': 'invalid_token'}), 400

if __name__ == '__main__':
    app.run(port=8888)
