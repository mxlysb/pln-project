import React from 'react';
import './App.css';
import $ from 'jquery';
import PromptComponent from './PromptComponent';

class App extends React.Component {
  constructor(props) {
    super(props);
    const parametros = this.getHashParams();
    this.token = parametros.access_token;
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q)
    }
    console.log(this.token)
    return hashParams;
  }


  getRecommendation = (artistsId) =>{
    console.log(artistsId)
    const artists = artistsId.join(",")
    $.ajax({
      method: "GET",
      dataType: "json",
      url:`https://api.spotify.com/v1/recommendations?limit=10&market=BR&seed_artists=${artists}`,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
    .then(dados => {
      for (const track of dados.tracks) {
        console.log(track.name)
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  handleValueFromPrompt = (value) => {
    return new Promise(async (resolve, reject) => {
      const artists = value.split(',');
      const artistsId = [];
  
      for (const artist of artists) {
        try {
          const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
            },
          });
  
          const data = await response.json();
  
          if (data.artists && data.artists.items.length > 0) {
            artistsId.push(data.artists.items[0].id);
            console.log(artistsId);
          } else {
            console.log(`Nenhum artista encontrado para "${artist}"`);
          }
        } catch (error) {
          console.error('Erro ao pesquisar o artista:', error);
          reject(error);
          return;
        }
      }
  
      resolve(artistsId);
      this.getRecommendation(artistsId)
    });
  };
  

  render() {
    return (
      <div className="App">
        <button><a href="http://localhost:8888">Logar com Spotify</a></button>
        <PromptComponent onValueSubmit={this.handleValueFromPrompt} />
      </div>
    );
  }
}

export default App;
