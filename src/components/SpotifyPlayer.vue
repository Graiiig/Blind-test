<script>
import {db, ref, set} from "@/assets/js/firebase";

let player;

export default {
  data() {
    return {
      title: 'Pas d\'écoute en cours',
      artist : 'Pas d\'écoute en cours',
      imgLink: 'https://picsum.photos/400',
      messageSpotify: 'Se connecter à Spotify',
      spotifyPlayerName: 'Blind test by Graig',
    }
  },
  watch : {
    'getIsMusicPlaying'(isMusicPlaying) {
      // Si la musique est à play sur l'appli, on play sur spotify
      if(isMusicPlaying){
        player.resume()
      }
      // Sinon pause
      else {
        player.pause()
      }
    },
    // On vérifie si on doit passer au morceau suivant
    'goNextTrack'(isGoNextTrack){
      if(isGoNextTrack){
        this.$store.commit('setCount', 10);
        this.$store.commit('setCountMax', 10);
      }
    },
    'getRequestSpotifyAuth'(){
      this.requestSpotifyAuth();
    }
  },
  methods: {
    // Fonction pour mettre à jour des données sur Firebase
    setDataFirebase(node, data) {
      set(ref(db, node), data);
    },
    // Permet de faire play/pause
    togglePlayPlayer() {
      player.togglePlay();
      this.setDataFirebase(import.meta.env.VITE_FIREBASE_DB_APP+'/isMusicPlaying', !this.$store.state.isMusicPlaying)
    },
    // Permet de passer au morceau suivant
    nextTrackPlayer(){
      player.nextTrack();
      this.$store.commit('setTitle', false);
      this.$store.commit('setArtist', false);
    },
    // Permet de passer au morceau précédent
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
    // La musique est en pause au (re)chargement de la page
    this.setDataFirebase(import.meta.env.VITE_FIREBASE_DB_APP + '/isMusicPlaying', false);

    let vm = this;
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
      // vm.$store.commit('setSpotifyToken', token)
      player = new Spotify.Player({
        name: this.spotifyPlayerName,
        getOAuthToken: cb => {
          cb(token);
          vm.$store.commit('setSpotifyToken', token)
        },
        volume: 0.5
      });

      //--------------- LOGS Spotify -----------------//
      // Ready
      player.addListener('ready', ({device_id}) => {
        console.log(player.getCurrentState())
        console.log('Ready with Device ID', device_id);
        this.$store.commit('setSpotifyDeviceId', device_id);
        this.$store.commit('setSpotifyMessage','En attente de séléction de "' + this.spotifyPlayerName + '" dans l\'appli Spotify !');
        this.$store.dispatch('transferSpotifyPlaybackToDevice');
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
        this.title = current_track.name;
        this.artist = current_track.artists[0].name;
        this.$store.commit('setSpotifyMessage', 'Appli Spotify connectée !');
        this.imgLink = current_track.album.images[2].url;
      });

      player.connect();

      setInterval(function () {
        if(vm.getCount > 0 && vm.getIsMusicPlaying){
          vm.$store.commit('decrementCount');
        }
        else if (vm.getCount === 0 && vm.getIsMusicPlaying)
        {
          vm.$store.dispatch('nextTrack');
        }
      }, 1000)
    }
  },
  mounted() {
    let spotify = document.createElement('script')
    spotify.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
    document.head.appendChild(spotify)
  },
  computed : {
    goNextTrack(){
      return this.$store.getters.getTitle && this.$store.getters.getArtist;
    },
    getIsMusicPlaying() {
      return this.$store.getters.getIsMusicPlaying;
    },
    getCount() {
      return this.$store.getters.getCount;
    },
    getCountMax() {
      return this.$store.getters.getCountMax;
    },
    getRequestSpotifyAuth() {
      return this.$store.getters.getRequestSpotifyAuth;
    }
  }
}
</script>
<template>
  <div id="musicCard" class="borderColored">
    <span class="musicPlayingIcon" :style="this.$store.getters.getIsMusicPlaying ? 'opacity:1' : 'opacity:0.1'"><font-awesome-icon icon="fa-solid fa-compact-disc" :spin="this.$store.state.isMusicPlaying" /></span>
    <span class="" style="float: left;margin-top: 2%;
    margin-left: 4%;
    font-size: 4vw;" :style="this.$store.getters.getIsMusicPlaying ? 'opacity:1' : 'opacity:0.1'">{{this.$store.getters.getCount}}</span>
    <br>
    <div class="space-around flex imgMusicCard">
      <img class="imgMusic" :src="imgLink" alt="image album">
      <br>
      <div class="row">
        <span id="previousTrack" class="button" @click="previousTrackPlayer()"><font-awesome-icon icon="fa-solid fa-backward-step"/></span>
        <span id="togglePlay" class="button" @click="togglePlayPlayer()"><font-awesome-icon :icon="this.$store.isMusicPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" :beat="this.$store.state.isMusicPlaying"/></span>
        <span id="nextTrack" class="button" @click="nextTrackPlayer()"><font-awesome-icon icon="fa-solid fa-forward-step"/></span>
        <br>
        <br>
        <br>
        <span style="font-size: 2vw;" :style="this.$store.getters.getArtist ? 'color : #5fe85f' : 'color : white'"><font-awesome-icon icon="fa-solid fa-microphone-lines"/> Artiste : {{ this.$store.getters.getArtist ? artist : 'non trouvé' }}</span>
        <br>
        <span style="font-size: 2vw;" :style="this.$store.getters.getTitle ? 'color : #5fe85f' : 'color : white'"> <font-awesome-icon icon="fa-solid fa-compact-disc"/> Titre : {{this.$store.getters.getTitle ? title : 'non trouvé'}}</span>
        <br>
        <br>
        <input type="range" id="timerRange" name="timerRange" min="0" :max="this.$store.getters.getCountMax"
               :value="this.$store.getters.getCountMax - this.$store.getters.getCount">
        <br>
      </div>
      <br>
    </div>
  </div>
</template>