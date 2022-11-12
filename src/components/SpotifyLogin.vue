<script>
export default {
  methods : {
    setRequestSpotifyAuth(getTime){
      this.$store.commit('setRequestSpotifyAuth', getTime)
    }
  },
  computed: {
    getTime() {
      // Génération d'un id pour trigger 'setRequestSpotifyAuth'
      let id = new Date();
      return id.getTime();
    },
    getMessageSpotify() {
      return this.$store.getters.getSpotifyMessage;
    }
  }
}
</script>
<template>
  <span id="loginSpotify" class="button"
        @click="setRequestSpotifyAuth(getTime)">{{ getMessageSpotify }}</span>
</template>
