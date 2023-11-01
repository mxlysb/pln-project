# RecPlay 🎧

## Sobre o projeto

A aplicação, através da API do OpenAI e Spotify, cria uma playlist baseada nos artistas que você escolhe. A playlist depois de criada, é adicionada automaticamente na sua conta do Spotify.

### Pré-requisitos
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
### Instalação e execução:

```
cd my-react-app
npm install
npm start

cd authentication
pip install Flask requests flask-cors
python authentication.py
