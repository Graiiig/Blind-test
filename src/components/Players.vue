<script>

import {db, ref, remove} from "@/assets/js/firebase";

export default {
  data() {
    return {
    }
  },
  methods : {
    goToBuzzer(user){
      let userParsed = JSON.parse(JSON.stringify(user));
      this.$router.push({
        name: "Buzzer",
        params: {
          username : userParsed.username
        },
      });
    },
    // Suppression d'un utilisateur dans la BDD
    removeUser(idFb) {
      remove(ref(db, import.meta.env.VITE_FIREBASE_GOOGLE_USERS + '/' + this.$store.getters.getGoogleUid + '/' + import.meta.env.VITE_FIREBASE_DB_USERS + '/' + idFb));
    },
  },
  computed : {
    getUsers(){
      return this.$store.getters.getUsers;
    }
  }
}
</script>
<template>
    <div v-for="(user, key) in getUsers" style="display: flex;align-items: center; margin-top: 2vh;justify-content: space-between;">
<!--      <img style="width:50px" :src="user.profilePicture" alt="Image de profile d'un utilisateur"/>-->
      <img style="width:50px" src="https://picsum.photos/400" alt="Image de profile d'un utilisateur"/>
      <span style="margin-left: 1%"  @click="goToBuzzer(user)">{{ user.username }} ({{user.points}} points)</span>
      <span style="margin-left: 7%; color: #c03333; cursor: pointer" @click="removeUser(key)"><font-awesome-icon icon="fa-solid fa-trash-can"/></span>
    </div>
</template>
