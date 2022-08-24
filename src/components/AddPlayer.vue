<script>

import {db, push, ref} from "@/assets/js/firebase";

export default {
  methods: {
    // Ajout d'un utilisateur dans la bdd
    addUser() {
      // Récupération des infos de l'utilisateur
      let username = document.querySelector('#username').value;
      // let buzzerId = document.querySelector('#buzzer').value;

      // Génération d'un id pour le state pour l'api Dicebear
      let id = new Date();
      id = id.getTime();

      // Récupération d'un avatar random
      let profilePicture = 'https://avatars.dicebear.com/api/avataaars/' + id + '.svg'

      // On push vers firebase le nouvel utilisateur
      push(ref(db, import.meta.env.VITE_FIREBASE_DB_USERS), {
        "buzzerId": 0,
        "username": username,
        "profilePicture": profilePicture,
        "points": 0
      }).key;

      // On cache le menu d'ajout d'un nouvel utilisateur
      this.$store.state.showMenuAddPlayer = false;
    },
  }
}
</script>
<template>
  <div class="card" :style="this.$store.state.showMenuAddPlayer ? 'visibility: visible;' : 'visibility: hidden;'">
    <div class="addUser flex space-around">
      <input id="username" placeholder="Pseudo">
      <span id="addUser" class="button" @click="addUser">Ajouter un utilisateur</span>
    </div>
  </div>
</template>
