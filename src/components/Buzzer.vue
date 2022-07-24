<script>
export default {
  data() {
    return {
      username : {},
      points : 0,
      spotifyToken : ''
    }
  },
  methods : {
    setBuzzerClicker : function () {
      // headers: {
      //   'Content-Type': 'application/json',
      //       'Authorization': 'Bearer my-token',
      //       'My-Custom-Header': 'foobar'
      // },
      const requestOptions = {
        method: 'PATCH',
        body: JSON.stringify({ nom: this.username })
      };
      fetch(import.meta.env.VITE_FIREBASE_DATABASE_URL+'/'+ import.meta.env.VITE_FIREBASE_DB_CLICKER + '.json', requestOptions)
          .then(response => response.json())
    }
  },
  mounted() {
    // On récupère les utilisateurs passés en paramètre de la route
    this.username = this.$route.params.username;
    this.points = this.$route.params.points;
    this.spotifyToken = this.$route.params.spotifyToken;
  }
}
</script>
<template>
  <router-link :to="'/#access_token='+this.spotifyToken"><font-awesome-icon icon="fa-solid fa-home" /></router-link>

  <div style="text-align: center; display: flex; flex-direction: column; align-items: center; height: 50vh;justify-content: space-evenly;" class="card borderColored">
      <span style="font-size: 1.5vw">Joueur/Joueuse : {{username}}</span>
      <div @click="setBuzzerClicker" class="buzzer" style="font-size: 2.5vw"> JE SAIIIS !!!</div>
  </div>
</template>