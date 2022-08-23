<script>
import {db, ref, set, onValue} from '@/assets/js/firebase';

export default {
  data() {
    return {
    }
  },
  props : {
    points : Number
  },
  watch : {
    'getClicker'(clicker, previousClicker) {
      if (this.$store.getters.getIsMusicPlaying && previousClicker !== clicker && clicker !== '' && (!this.$store.getters.getArtist || !this.$store.getters.getTitle)){
        this.$store.dispatch('changeModalStatus', {isShowModal : true, blur: 60, isMusicPlaying : false})
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
          if (user.username === this.getClicker){
            newPoints = parseInt(user.points) + parseInt(points);
            userKey = childSnapshot.key;
          }
        });
      });

      // On set le nouveau nombre de points
      set(ref(db, userNode+'/'+userKey + '/points'), newPoints);

      this.$store.dispatch('changeModalStatus', {isShowModal: false, blur: 0, isMusicPlaying: true})
    },
  },
  computed: {
    getClicker(){
      return this.$store.getters.getClicker;
    }
  }
}
</script>

<template>
  <div v-if="this.$store.state.showModal" class="modal borderColored">
    <span style="font-size: 2vw; cursor: pointer" @click="this.$store.dispatch('changeModalStatus', {isShowModal : false, blur: 0, isMusicPlaying : true})"><font-awesome-icon icon="fa-solid fa-circle-xmark" /></span>
    <p style="font-size: 2vw; text-align: center">{{this.$store.state.clicker}} a buzzé !!</p>

    <div style="display: flex; justify-content: space-around; margin-top: 3vh">
      <div class="button" @click="addPointsToUser(1); this.$store.commit('setArtist', true)" ><font-awesome-icon icon="fa-solid fa-microphone-lines"/> Artiste</div>
      <div class="button" @click="addPointsToUser(1); this.$store.commit('setTitle', true)" ><font-awesome-icon icon="fa-solid fa-compact-disc"/> Titre</div>
      <div class="button" @click="addPointsToUser(3); this.$store.commit('setTitle', true); this.$store.commit('setArtist', true)" ><font-awesome-icon icon="fa-solid fa-music"/> Artiste et Titre</div>
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