<script setup>
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import PlayersList from '../components/PlayersList.vue'
import AddPlayer from '../components/AddPlayer.vue'
import Modal from '../components/Modal.vue'
</script>

<script>
import {db, ref, set, push, onChildChanged, onValue, remove} from '../assets/js/firebase.js';

export default {
  data() {
    return {
      clicker: '',
      users: {},
      imgLink : 'https://picsum.photos/400',
      playerName : 'Blind test by Graig',
      showMenuAddPlayer : false,
      isMusicPlaying :false,
      version : import.meta.env.VITE_VERSION,
      spotifyToken : '',
      blur : "filter : blur(0px);",
      nextTrack : 0
    }
  },
  methods: {
    setDataFirebase(node, data){
      // On push vers firebase le nouvel utilisateur
      set(ref(db, node), data);
    },
    // Ajout d'un utilisateur dans la bdd
    addUser() {
      // Récupération des infos de l'utilisateur
      let username = document.querySelector('#username').value;
      let buzzerId = document.querySelector('#buzzer').value;

      // Génération d'un id pour le state pour l'api Dicebear
      let id = new Date();
      id = id.getTime();

      // Récupération d'un avatar random
      let profilePicture = 'https://avatars.dicebear.com/api/avataaars/' + id + '.svg'

      // On push vers firebase le nouvel utilisateur
      push(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS), {
        "buzzerId": buzzerId,
        "username": username,
        "profilePicture" : profilePicture,
        "points" : 0
      }).key;

      // On cache le menu d'ajout d'un nouvel utilisateur
      this.showMenuAddPlayer = false;
    },

    // Suppression d'un utilisateur dans la BDD
    removeUser(idFb){
      remove(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS+'/'+idFb));
    },
    showMenuAddPlayerFunction() {
      this.showMenuAddPlayer = !this.showMenuAddPlayer;
    },
    setMusicStatusPlayer(dataSpotifyPlayer){
      this.isMusicPlaying = dataSpotifyPlayer.isMusicPlaying;
      this.spotifyToken = dataSpotifyPlayer.spotifyToken;
    },
    resetBlurAndWinner(nextTrack){
      this.clicker = '';
      this.setDataFirebase(import.meta.env.VITE_FIREBASE_DB_CLICKER, {'nom' : ''})
      this.blur = "filter : blur(0px);";
      console.log(nextTrack)
      if (nextTrack){
        let today= new Date();
        this.nextTrack = today.getTime()
      }
    }
  },
  computed: {
    // Récupère l'utilisateur depuis la BDD quand celui-ci clique sur le buzzer
    getClickerFromDb: function () {
      let clickerDb = ref(db, import.meta.env.VITE_FIREBASE_DB_CLICKER);
      onChildChanged(clickerDb, (data) => {
        if (this.isMusicPlaying) {
          this.clicker = data.val();
          this.blur = "filter : blur(60px);";
        }
      });
    },
    // Récupère les utilisateurs depuis la BDD
    getUsersFromDb: function () {
      let userDb = ref(db, import.meta.env.VITE_FIREBASE_DB_USERS);
      onValue(userDb, (data) => {
        this.users = data.val();
      });
    }
  },
  created : function(){
    // Retourne le dernier gagnant inscrit en BDD
    // let clickerDb = ref(db, import.meta.env.VITE_FIREBASE_DB_CLICKER);
    // onValue(clickerDb, (snapshot) => {
    //   this.clicker = snapshot.val().nom;
    //   return snapshot.val().nom;
    // });

    // Fonctionnel - Commenté pour l'instant car coùte des calls API (50 gratuits par heure)
    // Choisit une image sur le thème de la musique au hasard dans la base de données unsplash
    // Et la met en fond d'écran de l'app
    // let url = 'https://api.unsplash.com/photos/random?client_id=' + import.meta.env.VITE_UNSPLASH_CLIENT_ID + '&query=music&orientation=landscape'
    // fetch(url)
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(data => {
    //         document.querySelector('#app').style.backgroundImage = "url(" + data.urls.full + ")";
    //     })
    document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1466428996289-fb355538da1b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2OTU&ixlib=rb-1.2.1&q=80')";
    // document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1501612780327-45045538702b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2Mzc&ixlib=rb-1.2.1&q=80')";
  }
}
</script>

<template>
  <main style="display: flex;justify-content: space-around;" :style="blur">
    <PlayersList :spotifyToken="spotifyToken" :users="users" @show-menu-add-player="showMenuAddPlayerFunction" @remove-user="removeUser"/>
    <SpotifyPlayer @set-music-player-status="setMusicStatusPlayer" :isMusicPlaying="isMusicPlaying" :clicker="clicker" :setNextTrack="nextTrack"/>
  </main>
  <AddPlayer :showMenuAddPlayer="showMenuAddPlayer" @add-user="addUser"/>
  <Modal :isMusicPlaying="isMusicPlaying" :clicker="clicker" @reset-blur-and-winner="resetBlurAndWinner"/>
</template>

