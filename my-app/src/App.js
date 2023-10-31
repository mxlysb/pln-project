import React from 'react';
import './App.css';
import $ from 'jquery';
import InputComponent from './InputComponent';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

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

  getRecommendation = (songTitle) =>{
    console.log(songTitle)
    const artists = songTitle.join(",")
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

  getUserId = async () => {
    try {
      const response = await $.ajax({
        method: "GET",
        dataType: "json",
        url: `https://api.spotify.com/v1/me`,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  
      return response.id;
    } catch (error) {
      console.error("Error when obtaining the user ID:", error);
      throw error;
    }
  }

  createPlaylist = async (userId) => {
    try {
      const response = await $.ajax({
        method: "POST",
        dataType: "json",
        url: `https://api.spotify.com/v1/users/${userId}/playlists`,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        data: JSON.stringify({
          name: "My Recommended Playlist",
          public: true,
          description: "Playlist created based on your favorite artists.",
        }),
      });
  
      return response.id;
    } catch (error) {
      console.error("Error when creating the playlist:", error);
    }
  }

   addItensPlaylist = async (idPlaylist, urisTracks) => {
    try {
      const response = await $.ajax({
        method: "POST",
        dataType: "json",
        url: `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        data: JSON.stringify({
          uris: urisTracks,
        }),
      });
    } catch (error) {
      console.error("Error when adding tracks to the playlist:", error);
    }
  }

  searchTrackByTitle = async (title) => {
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}&type=track`;
  
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  
    const data = await response.json();
    return data;
  };

  getUrisSpotify = async (titles) => {
    const uris = [];
  
    for (const title of titles) {
      const searchResults = await this.searchTrackByTitle(title);
      if (searchResults && searchResults.tracks.items.length > 0) {
        const trackUri = searchResults.tracks.items[0].uri;
        uris.push(trackUri);
      }
    }
  
    return uris;
  }
  

  handleValueFromPrompt = (value) => {
    return new Promise(async (resolve, reject) => {
      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", content: "You are a music expert specializing in recommendations."
          },
          {
            role: "user", content: `Recommend 30 unique songs that are most similar to the following ${value} and other similar artists. 
                                    Include 'title', 'artist', and 'album' in your response. An example response is: "
                                              [
                                                {
                                                    "title": "Hey Jude",
                                                    "artist": "The Beatles",
                                                    "album": "The Beatles (White Album)",
                                                }
                                              ]".` 
            }
        ],
        model: "gpt-3.5-turbo",
      });
    
      console.log("Criando playlist...")

      const responseContent = completion.choices[0].message.content;
      const titles = [];
      
      const titleRegex = /"title":\s*"([^"]+)"/g;
      let match;

      while ((match = titleRegex.exec(responseContent)) !== null) {
        titles.push(match[1]);
      }
      const userId = await this.getUserId()
      const idPlaylist = await this.createPlaylist(userId)
      const uris = await this.getUrisSpotify(titles)
      await this.addItensPlaylist(idPlaylist, uris)

      console.log("Playlist criada!")
    });
  };
  

  render() {
    return (
      <div className="App">
        <button><a href="http://localhost:8888">Logar com Spotify</a></button>
        <InputComponent onValueSubmit={this.handleValueFromPrompt } />
      </div>
    );
  }
}

export default App;
