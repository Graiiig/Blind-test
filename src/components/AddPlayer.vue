<script>

export default {
  data() {
    return {
    }
  }
}
</script>
<template>
  <div class="card" :style="this.$store.state.showMenuAddPlayer ? 'visibility: visible;' : 'visibility: hidden;'">
    <div class="addUser flex space-around">
      <input id="username" placeholder="Pseudo">
      <span id="addUser" class="button" @click="$emit('addUser')">Ajouter un utilisateur</span>
    </div>
  </div>
</template>
