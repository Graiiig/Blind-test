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

      let userNode = import.meta.env.VITE_FIREBASE_GOOGLE_USERS
      let dbUsers = import.meta.env.VITE_FIREBASE_DB_USERS

      // On récupère le nombre de points actuels
      onValue(ref(db, userNode + '/' + this.$store.getters.getGoogleUid + '/' + dbUsers), (snapshot) => {
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
    changeModalStatus(status){
      this.$store.dispatch('changeModalStatus', status);
    },
    setArtistOrTitle(type, status){
      this.$store.commit(type, status)
    }
  },
  computed: {
    getClicker(){
      return this.$store.getters.getClicker;
    },
    getIsShowModal(){
      return this.$store.getters.getIsShowModale;
    },
    getTitle() {
      return this.$store.getters.getTitle;
    },
    getArtist() {
      return this.$store.getters.getArtist;
    }
  }
}
</script>

<template>
  <div v-if="getIsShowModal" class="modal borderColored">
    <span style="font-size: 2vw; cursor: pointer" @click="changeModalStatus({isShowModal : false, blur: 0, isMusicPlaying : true})"><font-awesome-icon icon="fa-solid fa-circle-xmark" /></span>
    <p style="font-size: 2vw; text-align: center">{{getClicker}} a buzzé !!</p>

    <div style="display: flex; justify-content: space-around; margin-top: 3vh">
      <div :class="getArtist ? 'button-disabled button' : 'button'" @click="addPointsToUser(1); setArtistOrTitle('setArtist', true)" ><font-awesome-icon icon="fa-solid fa-microphone-lines"/> {{ getArtist ? 'Artiste trouvé' : 'Artiste'}}</div>
      <div :class="getTitle ? 'button-disabled button' : 'button'" @click="addPointsToUser(1); setArtistOrTitle('setTitle', true)" ><font-awesome-icon icon="fa-solid fa-compact-disc"/>
        {{ getTitle ? 'Titre trouvé' : 'Titre'}}</div>
      <div class="button" @click="addPointsToUser(3); setArtistOrTitle('setTitle', true); setArtistOrTitle('setArtist', true)" ><font-awesome-icon icon="fa-solid fa-music"/> Artiste et Titre</div>
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
}
</style>