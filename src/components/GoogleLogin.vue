<script>
import {auth, provider, signInWithPopup, signOut} from '../assets/js/firebase.js';
export default {
  data() {
    return {
      messageLoginGoogle: 'Se connecter avec Google'
    }
  },
  props : {
  },
  methods : {
    requestGoogleAuth() {
      signInWithPopup(auth, provider)
          .then((result) => {
            this.messageLoginGoogle = 'Connecté en tant que ' + result.user.displayName
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
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = provider.credentialFromError(error);
      });
    },
    requestGoogleLogOut(){
      signOut(auth);
    }
  }
}
</script>
<template>
  <span id="loginGoogle" class="button" @click="requestGoogleAuth()">{{ messageLoginGoogle }}</span>
</template>
