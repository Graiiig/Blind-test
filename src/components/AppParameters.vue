<script setup>
import PlayersList from '../components/PlayersList.vue'
import AddPlayer from '../components/AddPlayer.vue'
</script>
<script>

export default {
  data() {
    return {
    }
  },
  computed:{
    getTime(){
      // Génération d'un id pour le state pour l'api Dicebear
      let id = new Date();
      return id.getTime();
    },
    getMessageSpotify(){
      if(this.$store.state.spotifyToken === ''){
        return 'En attente de séléction de dans l\'appli Spotify !';
      }
      else {
        return 'Application Spotify connectée';
      }
    }
  }
}
</script>
<template>
  <div style="display: flex; flex-direction: column; height: 100vh; background-color: bisque; width: 25%;">
    en cours de setting du bouton
    <span id="loginSpotify" class="button" @click="this.$store.commit('setRequestSpotifyAuth', getTime)">{{ getMessageSpotify }}</span>
    <PlayersList @remove-user="removeUser"/>
    <AddPlayer @add-user="addUser"/>
  </div>
</template>
