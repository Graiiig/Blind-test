<script setup>
import PlayersList from '../components/PlayersList.vue'
import AddPlayer from '../components/AddPlayer.vue'
import GoogleLogin from '../components/GoogleLogin.vue'
import SpotifyLogin from '../components/SpotifyLogin.vue'
</script>

<template>
  <div class="sidebar">
    <SpotifyLogin/>
    <GoogleLogin/>
    <hr>
    <PlayersList/>
    <hr>
    <AddPlayer/>
  </div>
</template>
