<script>
import {db, ref, set, onValue} from '../assets/js/firebase.js';

export default {
  data() {
    return {
      username : {},
      points : 0,
      spotifyToken : ''
    }
  },
  methods : {
    setBuzzerClicker : function () {

      let clicker;
      let clickerNode = import.meta.env.VITE_FIREBASE_DB_CLICKER;

      // On récupère le nombre de points actuels
      onValue(ref(db, clickerNode), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          clicker = childSnapshot.val();
        });
      });

      // Si le dernier clicker est le même que le nouveau (cela arrive si un user buzz avec la musique sur pause)
      // on reset le 'clicker' pour que le changement de trigger bien tous les watchers
      if (clicker === this.username){
        set(ref(db, clickerNode), { nom: "" });
      }
      set(ref(db, clickerNode), { nom: this.username });
    }
  },
  mounted() {
    // On récupère les utilisateurs passés en paramètre de la route
    this.username = this.$route.params.username;
    this.points = this.$route.params.points;
    this.spotifyToken = this.$route.params.spotifyToken;
  }
}
</script>
<template>
  <router-link :to="'/#access_token='+this.spotifyToken"><font-awesome-icon icon="fa-solid fa-home" /></router-link>

  <div style="text-align: center; flex-direction: column; align-items: center; height: 50vh;justify-content: space-evenly;" class="card borderColored flex">
      <span style="font-size: 3.5vh">Joueur/Joueuse : {{username}}</span>
      <div @click="setBuzzerClicker" class="buzzer" style="font-size: 4.5vh"> JE SAIIIS !!!</div>
  </div>
</template>