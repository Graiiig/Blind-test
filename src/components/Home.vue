<script setup>
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import PlayersList from '../components/PlayersList.vue'
import AddPlayer from '../components/AddPlayer.vue'
</script>

<script>
import {getDatabase, ref, set, push, onChildChanged, onValue, remove } from 'firebase/database'
import {initializeApp} from 'firebase/app'

// Récupération de la config Firebase depuis .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const appFb = initializeApp(firebaseConfig);

const db = getDatabase();

export default {
  data() {
    return {
      clicker: '',
      users: {},
      imgLink : 'https://picsum.photos/400',
      playerName : 'Blind test by Graig',
      showMenuAddPlayer : false,
      isMusicPlaying :false,
      version : import.meta.env.VITE_VERSION
    }
  },
  methods: {
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
        "profilePicture" : profilePicture
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
    setMusicStatusPlayer(status){
       // TODO : Le status ne remote pas jusque ici
      console.log("status", status)
      this.isMusicPlaying = status;
    }
  },
  computed: {
    // Récupère l'utilisateur depuis la BDD quand celui-ci clique sur le buzzer
    getClickerFromDb: function () {
      let clickerDb = ref(db, import.meta.env.VITE_FIREBASE_DB_CLICKER);
      onChildChanged(clickerDb, (data) => {
        this.clicker = data.val();
        this.isMusicPlaying = !this.isMusicPlaying
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
    let clickerDb = ref(db, import.meta.env.VITE_FIREBASE_DB_CLICKER);
    onValue(clickerDb, (snapshot) => {
      this.clicker = snapshot.val().nom;
      return snapshot.val().nom;
    });

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
  }
}
</script>

<template>
  <main style="display: flex;justify-content: space-around;">
    <PlayersList :users="users" @show-menu-add-player="showMenuAddPlayerFunction" @remove-user="removeUser"/>
    <SpotifyPlayer @set-music-player-status="setMusicStatusPlayer" :isMusicPlaying="isMusicPlaying" :clicker="clicker"/>
  </main>
  <AddPlayer :showMenuAddPlayer="showMenuAddPlayer" @add-user="addUser"/>
</template>

