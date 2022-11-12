<script setup>
import SpotifyPlayer from '../components/SpotifyPlayer.vue'
import Sidebar from './Sidebar.vue'
import Modal from '../components/Modal.vue'
import PlayersQrCodes from "../components/PlayersQrCodes.vue";

</script>

<script>
import {db, ref, onChildChanged} from '@/assets/js/firebase';

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
  created(){
    // Récupère l'utilisateur depuis la BDD quand celui-ci clique sur le buzzer
    let userNode = import.meta.env.VITE_FIREBASE_GOOGLE_USERS
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

