<script>

export default {
  data() {
    return {
      messageSpotify: 'Se connecter à Spotify'
    }
  },
  props : {
    users : Object,
    showMenuAddPlayer : Boolean
  },
}
</script>
<template>
  <div class="card" style="margin-top: 1%; justify-content: center;display: flex;" :style="showMenuAddPlayer ? 'visibility: visible;' : 'visibility: hidden;'">
    <div class="addUser" style="display: flex; justify-content: space-around;  width: 50%; height: 10%">
      <input id="username" placeholder="Pseudo">
      <input id="buzzer" placeholder="N° du Buzzer">
      <span id="addUser" class="button" @click="$emit('addUser')">Ajouter un utilisateur</span>
    </div>
  </div>
</template>
