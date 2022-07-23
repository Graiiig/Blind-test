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
    users : Object
  },
}
</script>
<template>
  <div style="width: 15%; margin-top: 3%">
    <h3 >Joueurs : <span @click="$emit('showMenuAddPlayer')"><font-awesome-icon icon="fa-solid fa-plus-circle" /></span></h3>
    <Players :users="users"/>
  </div>
</template>
