<script setup >
  import Players from "./Players.vue";
</script>
<script>
export default {
  data() {
    return {
    }
  },
  props : {
    users : Object,
    spotifyToken : String
  },
}
</script>
<template>
  <div style="width: 15%; margin-top: 3%" class="borderColored playersList">
    <h3 >Joueurs : <span style="cursor: pointer" @click="$emit('showMenuAddPlayer')"><font-awesome-icon icon="fa-solid fa-plus-circle" /></span></h3>
    <Players :spotifyToken="spotifyToken" :users="users"/>
  </div>
</template>
