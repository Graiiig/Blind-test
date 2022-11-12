<script>
import {set,auth, provider, ref, db, onValue, signInWithPopup, signOut} from '@/assets/js/firebase';
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
            this.messageLoginGoogle = 'Connecté en tant que ' + result.user.displayName + ' (Cliquer pour se déconnecter)'
            // This gives you a Google Access Token. You can use it to access the Google API.
            // The signed-in user info.
            const user = result.user;

            let userNode = import.meta.env.VITE_FIREBASE_GOOGLE_USERS;
            // On récupère les utilisateurs qui se sont déjà identifiés
            onValue(ref(db, userNode + '/' + user.uid), (snapshot) => {

              // Si l'utilisateur est déjà en bdd, on récupère ses infos
              if (snapshot.val() !== null) {
                // Récupération des datas depuis Firebase, dernier qui a buzzé + status musique
                let dbFb = ref(db, userNode + '/' + user.uid);
                onValue(dbFb, (data) => {
                  let dataFromDb = data.val();
                  this.$store.commit('setIsMusicPlaying', dataFromDb.appSettings.isMusicPlaying)
                  this.$store.commit('setClicker', dataFromDb.clicker.nom)
                  this.$store.commit('setUsers', dataFromDb.users)
                });
              } else {
                // Sinon on set les infos du user en bdd
                set(ref(db, userNode + '/' + user.uid), {
                  "email": user.email,
                  "name": user.displayName,
                  "appSettings": {
                    "isMusicPlaying": false,
                    "spotifyToken": ""
                  },
                  "clicker": {
                    "nom": ""
                  },
                  "users": {
                    "nom": "joueur par défaut"
                  }
                });
              }
            }, {
              onlyOnce: true
            });

            this.$store.commit('setGoogleUid', user.uid)
            // ...
          }).catch((error) => {
        // const credential = provider.credentialFromError(error);
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
    this.requestGoogleAuth()
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
  <span id="loginGoogle" class="button" @click="this.isGoogleConnected ? requestGoogleLogOut() : requestGoogleAuth()">{{ messageBoutonGoogle }}</span>
</template>
