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
  methods : {
    goToBuzzer(user){
      let userParsed = JSON.parse(JSON.stringify(user));
      this.$router.push({
        name: "Buzzer",
        params: {
          points: userParsed.points,
          username : userParsed.username,
          spotifyToken : this.spotifyToken
        },
      });
    },
  }
}
</script>
<template>
  <div v-for="(user, key) in users">
    <div style="display: flex;align-items: center;">
      <img style="width:50px" :src="user.profilePicture" alt="Image de profile d'un utilisateur"/>
      <span style="margin-left: 1%"  @click="goToBuzzer(user)">{{ user.username }} ({{user.points}} points)</span>
      <span style="margin-left: 7%; color: #c03333; cursor: pointer" @click="$emit('removeUser', key)"><font-awesome-icon icon="fa-solid fa-trash-can"/></span>
    </div>
  </div>
</template>
