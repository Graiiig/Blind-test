<script setup>
  import GoogleLogin from './GoogleLogin.vue'
</script>
<script>
let player;

export default {
  data() {
    return {
      currentPlaying: 'Pas d\'écoute en cours',
      imgLink: 'https://picsum.photos/400',
      messageSpotify: 'Se connecter à Spotify',
      playerName: 'Blind test by Graig',
      spotifyToken : ''
    }
  },
  props : {
    isMusicPlaying : Boolean,
    clicker : String,
    setNextTrack : Number
  },
  watch : {
    clicker(val) {
      this.togglePlayPlayer();
    },
    spotifyToken() {
      this.$emit('setMusicPlayerStatus', {
        isMusicPlaying : false,
        spotifyToken : this.spotifyToken
      });
    },
    setNextTrack(){
      this.nextTrackPlayer();
    }
  },
  methods: {
    // Permet de faire play/pause
    togglePlayPlayer() {
      player.togglePlay();
      this.$emit('setMusicPlayerStatus', {
        isMusicPlaying : !this.isMusicPlaying,
        spotifyToken : this.spotifyToken
    });
    },
    nextTrackPlayer(){
      player.nextTrack()
    },
    previousTrackPlayer(){
      player.previousTrack()
    },
    // Permet d'initier le process d'identification Spotify
    requestSpotifyAuth(){
      let scope = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state streaming playlist-modify-private user-library-read user-read-private';
      let url = 'https://accounts.spotify.com/authorize';
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(import.meta.env.VITE_SPOTIFY_CLIENT_ID);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
      url += '&show_dialog=true';
      window.location.href = url;
    },
  },
  created() {
    // Initie la création du player spotify
    window.onSpotifyWebPlaybackSDKReady = () => {
      // Après clique sur le bouton du login, l'access token se retrouve dans l'url
      // On peut ainsi le recupérer pour la création du player
      let params = window.location.hash;
      let token = '';
      if (params.length > 0) {
        token = params.split('&');
        token = token[0].slice(14);
      }

      this.spotifyToken = token;
      player = new Spotify.Player({
        name: this.playerName,
        getOAuthToken: cb => {
          cb(token);
        },
        volume: 0.5
      });

      //--------------- LOGS Spotify -----------------//
      // Ready
      player.addListener('ready', ({device_id}) => {
        console.log(player.getCurrentState())
        console.log('Ready with Device ID', device_id);
        this.messageSpotify = 'En attente de séléction de "' + this.playerName + '" dans l\'appli Spotify !'
      });

      // Not Ready
      player.addListener('not_ready', ({device_id}) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({message}) => {
        console.error('initialization_error', message);
      });

      player.addListener('authentication_error', ({message}) => {
        console.error('authentication_error', message);
        // Permet de se relogguer si le token est expiré !
        this.requestAuth();
      });

      player.addListener('account_error', ({message}) => {
        console.error('account_error', message);
      });

      //--------------- FIN LOGS Spotify -----------------//

      // Récupération d'infos lorsque le player change de statut (changement de piste par exemple)
      player.addListener('player_state_changed', ({position, duration, track_window: {current_track}}) => {
        console.log('Currently Playing', current_track);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
        console.log("image", current_track.album.images[2].url)
        this.currentPlaying = current_track.name;
        this.messageSpotify = 'Appli Spotify connectée !';
        this.imgLink = current_track.album.images[2].url;
      });

      player.connect();
    }
  },
  mounted() {
    let spotify = document.createElement('script')
    spotify.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
    document.head.appendChild(spotify)
  },
}
</script>
<template>
  <div id="musicCard" class="borderColored">
    <span class="musicPlayingIcon" :style="isMusicPlaying ? 'opacity:1' : 'opacity:0.1'"><font-awesome-icon icon="fa-solid fa-compact-disc" :spin="isMusicPlaying" /></span>
    <br>
    <div class="space-around flex imgMusicCard">
      <img class="imgMusic" :src="imgLink" alt="image album">
      <br>
      <div class="row">
        <span id="previousTrack" class="button" @click="previousTrackPlayer()"><font-awesome-icon icon="fa-solid fa-backward-step"/></span>
        <span id="togglePlay" class="button" @click="togglePlayPlayer()"><font-awesome-icon :icon="isMusicPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" :beat="isMusicPlaying"/></span>
        <span id="nextTrack" class="button" @click="nextTrackPlayer()"><font-awesome-icon icon="fa-solid fa-forward-step"/></span>
        <br>
        <br>
        <br>
        <span>Musique en cours : {{currentPlaying}}</span>
      </div>
      <br>
    </div>
  </div>
  <div class="flex" style="flex-direction: column">

  <span id="loginSpotify" class="button" @click="requestSpotifyAuth()">{{messageSpotify}}</span>
  <GoogleLogin/>
  </div>
</template>
