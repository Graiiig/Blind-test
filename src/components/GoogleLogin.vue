<script>
import {auth, provider, ref, db, onValue, signInWithPopup, signOut} from '@/assets/js/firebase';
export default {
  data() {
    return {
      messageBoutonGoogle: 'Se connecter avec Google'
    }
  },
  methods : {
    requestGoogleAuth() {
      signInWithPopup(auth, provider)
          .then((result) => {
            this.messageBoutonGoogle = 'Connecté en tant que ' + result.user.displayName + ' (Cliquer pour se déconnecter)'
      });
    },
    requestGoogleLogOut(){
      signOut(auth);
      this.messageBoutonGoogle = 'Se connecter avec Google';
    },
    getUsers() {
      // Récupération des users en BDD à la création du component
      let userDb = ref(db, import.meta.env.VITE_FIREBASE_DB_USERS);
      onValue(userDb, (data) => {
        this.$store.commit('setUsers',data.val());
      });
    },
  },
  computed: {
    isGoogleConnected(){
      return this.messageBoutonGoogle !== 'Se connecter avec Google';
    }
  },
  created() {
    let vm = this;
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        vm.messageBoutonGoogle = 'Connecté en tant que ' + user.displayName + ' (Cliquer pour se déconnecter)';
        // // Récupération des users en BDD à la connexion Google
        vm.getUsers();
      } else {
        // No user is signed in.
        vm.messageBoutonGoogle = 'Se connecter avec Google';
        vm.users = {};
      }
    });
  }
}
</script>
<template>
  <span id="loginGoogle" class="button" :style="this.isGoogleConnected ? 'display : none' : 'display : block'" @click="this.isGoogleConnected ? requestGoogleLogOut() : requestGoogleAuth()">{{ messageBoutonGoogle }}</span>
</template>
