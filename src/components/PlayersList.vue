<script setup >
  import Players from "./Players.vue";
</script>
<script>

export default {
  methods : {
    removeUser(idFb){
      this.$emit('removeUser', idFb)
    },
    setShowMenuAddPlayer(){
      this.$store.commit('setShowMenuAddPlayer', !this.$store.getters.getShowMenuAddPlayer)
    },
    setShowModalPlayersQrcodes() {
      this.$store.commit('setShowModalPlayersQrcodes', !this.$store.getters.getShowModalPlayersQrcodes)
    }
  },
}
</script>
<template>
  <div class="playersList">
    <h3 >Joueurs :
      <span class="pointer" @click="setShowMenuAddPlayer"><font-awesome-icon icon="fa-solid fa-plus-circle" /></span>
      <span class="pointer" style="margin-left: 1vw" @click="setShowModalPlayersQrcodes"><font-awesome-icon icon="fa-solid fa-qrcode"/></span>
    </h3>
    <Players/>
  </div>
</template>
