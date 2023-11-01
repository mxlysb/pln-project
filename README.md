# Recplay

No arquivo ```authentication``` inserir as informações necessárias:

```
client_id = 'seu_client_id'
client_secret = 'seu_secret'
redirect_uri = 'sua_URI_de_redirecionamento'
```
No arquivo ```.env``` inserir seu Id do openAI:

```
REACT_APP_OPENAI_API_KEY=OPENAI_API_KEY
```

Para rodar:

```
cd my-react-app
npm install
npm start

cd authentication
pip install Flask requests flask-cors
python authentication.py
`