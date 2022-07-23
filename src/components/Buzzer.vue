<script>
export default {
  data() {
    return {
      user : {}
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
        body: JSON.stringify({ nom: this.user.username })
      };
      fetch(import.meta.env.VITE_FIREBASE_DATABASE_URL+'/'+ import.meta.env.VITE_FIREBASE_DB_CLICKER + '.json', requestOptions)
          .then(response => response.json())
    }
  },
  mounted() {
    // On récupère les utilisateurs passés en paramètre de la route
    this.user = JSON.parse(this.$route.params.data);
  }
}
</script>
<template>
  <div @click="setBuzzerClicker" style="border-radius: 50%;width: 200px;height: 200px;background-color: #304ffe;">
    <span>{{user.username}}</span>
  </div>
</template>