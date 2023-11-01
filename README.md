# RecPlay 🎧

## Sobre o projeto

A aplicação, através da API do OpenAI e Spotify, cria uma playlist baseada nos artistas escolhidos pelo usuário. A playlist depois de criada, é adicionada automaticamente na sua conta do Spotify.

### Sobre o código
1. O usuário faz uma solicitação à API com base em sua preferência de artistas musicais.
2. O ChatGPT gera recomendações de músicas com base nessa preferência.
3.  A API retorna as recomendações geradas pelo ChatGPT.
4.  As músicas são adicionadas na playlist
5.  E, por fim, a playlist é criada e adicionada na sua conta do Spotify.



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
```
### Frontend

Digite os artistas que desejar separados por ```,``` (vírgula)


