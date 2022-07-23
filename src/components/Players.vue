<script>

export default {
  data() {
    return {
    }
  },
  props : {
    users : Object
  },
  methods : {
    goToBuzzer(user){
      this.$router.push({
        name: "Buzzer",
        params: { data: JSON.stringify(user)},
      });
    },
  }
}
</script>
<template>
  <div v-for="{user, key} in users">
    <div style="display: flex;align-items: center;" @click="goToBuzzer(user)">
      <img style="width:50px" :src="user.profilePicture" alt="Image de profile d'un utilisateur"/>
      <span style="margin-left: 1%">{{ user.username }} ({{ user.buzzerId }})</span>
      <span style="margin-left: 7%; color: #c03333; cursor: pointer" @click="$emit('removeUser', key)"><font-awesome-icon icon="fa-solid fa-trash-can"/></span>
    </div>
  </div>
</template>
