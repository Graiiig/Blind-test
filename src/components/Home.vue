<script setup>
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import Sidebar from './Sidebar.vue'
import Modal from '../components/Modal.vue'
import PlayersQrCodes from "../components/PlayersQrCodes.vue";

</script>

<script>
import {db, ref, onChildChanged, onValue} from '@/assets/js/firebase';

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
  mounted(){

    let userNode = import.meta.env.VITE_FIREBASE_GOOGLE_USERS
    if (this.getGoogleUid !== '') {

      // La musique est en pause au (re)chargement de la page
      let dbFb = ref(db, userNode + '/' + this.getGoogleUid + '/');
      onValue(dbFb, (data) => {
        console.log(this.getGoogleUid)
        console.log(data.val())
          let dataFromDb = data.val();
          this.$store.commit('setIsMusicPlaying', dataFromDb.appSettings.isMusicPlaying)
          this.$store.commit('setClicker', dataFromDb.clicker.nom)
          this.$store.commit('setUsers', dataFromDb.users)
      });
    }

    // Récupère l'utilisateur depuis la BDD quand celui-ci clique sur le buzzer
    let clicker = import.meta.env.VITE_FIREBASE_DB_CLICKER
    let clickerDb = ref(db, userNode + '/' + this.$store.getters.getGoogleUid + '/' + clicker);
    onChildChanged(clickerDb, (data) => {
      if (this.$store.state.isMusicPlaying) {
        this.$store.commit('setClicker', data.val());
      }
    });
  },
  computed:{
    getBlur(){
      return "filter : blur("+this.$store.state.blur+"px);"
    },
    getGoogleUid(){
      return this.$store.getters.getGoogleUid;
    }
  }
}
</script>

<template>
  <main class="flex" :style="getBlur">
    <Sidebar/>
    <SpotifyPlayer/>
    <PlayersQrCodes/>
  </main>
  <Modal/>
</template>

