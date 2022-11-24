<script>
import {set,auth, provider, ref, db, onValue, signInWithPopup, signOut, onAuthStateChanged} from '@/assets/js/firebase';
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
            this.getAndSetUserDataInDb(result.user);
          });
    },
    getAndSetUserDataInDb(user){
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
              "idDefaut": {
                "nom": "joueur par défaut"
              }
            }
          });
        }
      }, {
        onlyOnce: true
      });

      this.$store.commit('setGoogleUid', user.uid)
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
    },
    showGoogleLoginModal(){
      return this.$store.getters.getIsShowGoogleLoginModale;
    }
  },
  created() {
    let vm = this;
    auth.onAuthStateChanged(function (user) {

      // Si l'utilisateur est connecté, on récupère les infos de celui-ci
      if (user) {
        vm.getAndSetUserDataInDb(user);
        // User is signed in.
        vm.messageBoutonGoogle = 'Connecté en tant que ' + user.displayName + ' (Cliquer pour se déconnecter)';
        // // Récupération des users en BDD à la connexion Google
        vm.getUsers();
        // Et on cache la modale de connexion Google
        vm.$store.commit('setGoogleLoginModal', false);
      }
      // Sinon on affiche la modale pour se connecter avec Google
      else {
        vm.$store.commit('setGoogleLoginModal', true);
        vm.messageBoutonGoogle = 'Se connecter avec Google';
        vm.users = {};
      }
    });
  }
}
</script>
<template>
  <span id="loginGoogle" class="button" :style="!this.isGoogleConnected ? 'display:none;' : ''" @click="this.isGoogleConnected ? requestGoogleLogOut() : requestGoogleAuth()">{{ messageBoutonGoogle }}</span>
  <div v-if="showGoogleLoginModal" class="modal">
    <div class="flex flex-column">
      <span>
        Vous allez bientôt pouvoir vous amusez comme des petits fous, mais avant ça il faut que le "maître DJ" se connecte avec Google !
      </span>
      <span id="loginGoogle" class="button" @click="this.isGoogleConnected ? requestGoogleLogOut() : requestGoogleAuth()">{{ messageBoutonGoogle }}</span>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 15%;
  width: 70%;
  height: 33vh;
  padding: 2vh;
  background-color: rgba(215, 131, 47, 0.9);
}
</style>