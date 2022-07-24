<script>
import {db, ref, set, push, onChildChanged, onValue, remove} from '../assets/js/firebase.js';

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
    clicker : function () {
      if (this.isMusicPlaying){
        this.open = true;
      }
    }
  },
  methods : {
    addPointsToUser(points){
      //TODO : Ajout des points
      const dbRef = ref(db, 'users');
      onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          console.log(childSnapshot)
        });
      });
    }
  }
}
</script>

<template>
  <div v-if="open" class="modal borderColored">
    <span style="font-size: 2vw; cursor: pointer" @click="open = false; $emit('resetBlurAndWinner')"><font-awesome-icon icon="fa-solid fa-circle-xmark" /></span>
    <p style="font-size: 2vw; text-align: center">{{clicker}} a buzzé !!</p>

    <div style="display: flex; justify-content: space-around; margin-top: 3vh">
      <div class="button"><font-awesome-icon icon="fa-solid fa-microphone-lines" /> Artiste</div>
      <div class="button"><font-awesome-icon icon="fa-solid fa-compact-disc" /> Titre</div>
      <div class="button"><font-awesome-icon icon="fa-solid fa-music" /> Artiste et Titre</div>
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