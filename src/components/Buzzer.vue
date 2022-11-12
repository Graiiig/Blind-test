<script>
import {db, ref, set, onValue} from '@/assets/js/firebase';

export default {
  data() {
    return {
      username : {},
      googleUid : "",
    }
  },
  methods : {
    setBuzzerClicker : function () {
      if(this.isMusicPlaying){
        let clicker;
        let clickerNode = import.meta.env.VITE_FIREBASE_DB_CLICKER;
        let userNode = import.meta.env.VITE_FIREBASE_GOOGLE_USERS
        clickerNode = userNode + '/' + this.googleUid + '/' + clickerNode;

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
    }
  },
  computed : {
    getSpotifyToken(){
      return this.$store.getters.getSpotifyToken;
    },
    isMusicPlaying(){
      return this.$store.getters.getIsMusicPlaying;
    }
  },
  mounted() {
    // On récupère les utilisateurs passés en paramètre de la route
    this.username = this.$route.params.username;
    this.googleUid = this.$route.params.googleUid;
  }
}
</script>
<template>
  <router-link :to="'/#access_token=' + getSpotifyToken"><font-awesome-icon icon="fa-solid fa-home" /></router-link>
  <div style="text-align: center; flex-direction: column; align-items: center; height: 50vh;justify-content: space-evenly;" class="flex">
      <span style="font-size: 3.5vh">Joueur/Joueuse : {{ username }}</span>
      <div @click="setBuzzerClicker" class="buzzer" style="font-size: 4.5vh"> JE SAIIIS !!!</div>
  </div>
</template>