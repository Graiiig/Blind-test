<script>
import {auth, provider, signInWithPopup, signOut} from '../assets/js/firebase.js';
export default {
  data() {
    return {
      messageLoginGoogle: 'Se connecter avec Google'
    }
  },
  props : {
    messageBoutonGoogle : String
  },
  watch: {
    messageBoutonGoogle() {
      this.messageLoginGoogle = this.messageBoutonGoogle;
    }
  },
  methods : {
    requestGoogleAuth() {
      signInWithPopup(auth, provider)
          .then((result) => {
            this.messageLoginGoogle = 'Connecté en tant que ' + result.user.displayName + ' (Cliquer pour se déconnecter)'
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = provider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
          }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The AuthCredential type that was used.
        // const credential = provider.credentialFromError(error);
      });
    },
    requestGoogleLogOut(){
      signOut(auth);
      this.messageLoginGoogle = 'Se connecter avec Google';
    }
  }
}
</script>
<template>
  <span id="loginGoogle" class="button" @click="messageLoginGoogle === 'Se connecter avec Google' ? requestGoogleAuth() : requestGoogleLogOut()">{{ messageLoginGoogle }}</span>
</template>
