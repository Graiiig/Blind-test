<script>
import {db, ref, set, onValue} from '../assets/js/firebase.js';

export default {
  data() {
    return {
      open: false
    }
  },
  props : {
    clicker : String,
    isMusicPlaying : Boolean,
    points : Number
  },
  watch : {
    clicker() {
      if (this.isMusicPlaying){
        this.open = true;
      }
    }
  },
  methods : {
    addPointsToUser(points){
      let newPoints;
      let userKey;
      let userNode = import.meta.env.VITE_FIREBASE_DB_USERS;

      // On récupère le nombre de points actuels
      onValue(ref(db, userNode), (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          let user = childSnapshot.val();
          if (user.username === this.clicker){
            newPoints = parseInt(user.points) + parseInt(points);
            userKey = childSnapshot.key;
          }
        });
      });

      // On set le nouveau nombre de points
      set(ref(db, userNode+'/'+userKey + '/points'), newPoints);
    }
  }
}
</script>

<template>
  <div v-if="open" class="modal borderColored">
    <span style="font-size: 2vw; cursor: pointer" @click="open = false; $emit('resetBlurAndWinner', false)"><font-awesome-icon icon="fa-solid fa-circle-xmark" /></span>
    <p style="font-size: 2vw; text-align: center">{{clicker}} a buzzé !!</p>

    <div style="display: flex; justify-content: space-around; margin-top: 3vh">
      <div class="button" @click="addPointsToUser(1); open = false; $emit('resetBlurAndWinner', false, 'artist')" ><font-awesome-icon icon="fa-solid fa-microphone-lines"/> Artiste</div>
      <div class="button" @click="addPointsToUser(1); open = false; $emit('resetBlurAndWinner', false, 'title')" ><font-awesome-icon icon="fa-solid fa-compact-disc"/> Titre</div>
      <div class="button" @click="addPointsToUser(3); open = false; $emit('resetBlurAndWinner', true, 'both')" ><font-awesome-icon icon="fa-solid fa-music"/> Artiste et Titre</div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 25%;
  width: 50%;
  height: 33vh;
  padding: 2vh;
  border-radius: 5%;
}
</style>