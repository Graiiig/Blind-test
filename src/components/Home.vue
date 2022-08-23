<script setup>
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import PlayersList from '../components/PlayersList.vue'
import AddPlayer from '../components/AddPlayer.vue'
import Modal from '../components/Modal.vue'
</script>

<script>
import {db, ref, set, push, onChildChanged, onValue, remove, auth} from '@/assets/js/firebase';

export default {
  data() {
    return {
      users: {},
      imgLink : 'https://picsum.photos/400',
      playerName : 'Blind test by Graig',
      version : import.meta.env.VITE_VERSION,
      spotifyToken : '',
      messageBoutonGoogle : ''
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
      // let buzzerId = document.querySelector('#buzzer').value;

      // Génération d'un id pour le state pour l'api Dicebear
      let id = new Date();
      id = id.getTime();

      // Récupération d'un avatar random
      let profilePicture = 'https://avatars.dicebear.com/api/avataaars/' + id + '.svg'

      // On push vers firebase le nouvel utilisateur
      push(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS), {
        "buzzerId": 0,
        "username": username,
        "profilePicture" : profilePicture,
        "points" : 0
      }).key;

      // On cache le menu d'ajout d'un nouvel utilisateur
      this.$store.state.showMenuAddPlayer = false;
    },
    getUsers() {
      // Récupération des users en BDD à la création du component
      let userDb = ref(db, import.meta.env.VITE_FIREBASE_DB_USERS);
      onValue(userDb, (data) => {
        this.users = data.val();
      });
    },
    // Suppression d'un utilisateur dans la BDD
    removeUser(idFb){
      remove(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS+'/'+idFb));
    },
  },
  created(){
    // Récupère l'utilisateur depuis la BDD quand celui-ci clique sur le buzzer
    let clickerDb = ref(db, import.meta.env.VITE_FIREBASE_DB_CLICKER);
    onChildChanged(clickerDb, (data) => {
      if (this.$store.state.isMusicPlaying) {
        this.$store.commit('setClicker', data.val());
      }
    });

    let vm = this;
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        vm.messageBoutonGoogle = 'Connecté en tant que ' + user.displayName + ' (Cliquer pour se déconnecter)';
        // Récupération des users en BDD à la connexion Google
        vm.getUsers();
      } else {
        // No user is signed in.
        vm.messageBoutonGoogle = 'Se connecter avec Google';
        vm.users = {};
      }
    });
    // Fonctionnel - Commenté pour l'instant car coûte des calls API (50 gratuits par heure)
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
    // document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1466428996289-fb355538da1b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2OTU&ixlib=rb-1.2.1&q=80')";
    // document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1501612780327-45045538702b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2Mzc&ixlib=rb-1.2.1&q=80')";
  },
  computed:{
    getBlur(){
      return "filter : blur("+this.$store.state.blur+"px);"
    }
  }
}
</script>

<template>
  <main class="flex space-around" :style="getBlur">
    <PlayersList :spotifyToken="spotifyToken" :users="users" @remove-user="removeUser"/>
    <SpotifyPlayer :message-bouton-google="messageBoutonGoogle"/>
  </main>
  <AddPlayer @add-user="addUser"/>
  <Modal/>
</template>

