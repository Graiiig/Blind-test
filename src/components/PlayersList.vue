<script setup >
  import Players from "./Players.vue";
</script>
<script>

export default {
  data() {
    return {
    }
  },
  methods : {
    removeUser(idFb){
      this.$emit('removeUser', idFb)
    },
    showMenuAddPlayerFunction() {
      this.$store.state.showMenuAddPlayer = !this.$store.state.showMenuAddPlayer;
    },
  }
}
</script>
<template>
  <div class="playersList">
    <h3 >Joueurs : <span style="cursor: pointer" @click="showMenuAddPlayerFunction"><font-awesome-icon icon="fa-solid fa-plus-circle" /></span></h3>
    <Players @remove-user="removeUser"/>
  </div>
</template>
