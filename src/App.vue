<template>
  <router-view></router-view>
</template>
<script>
import {db, onValue, ref} from "@/assets/js/firebase";

export default {
  created : function(){

    // Pour l'instant, on met une image en dur en background
    document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1501612780327-45045538702b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2Mzc&ixlib=rb-1.2.1&q=80')";

    // Récupération des datas depuis Firebase, dernier qui a buzzé + status musique
    let dbFb = ref(db, '/');
    onValue(dbFb, (data) => {
      let dataFromDb = data.val();
      this.$store.commit('setIsMusicPlaying', dataFromDb.appSettings.isMusicPlaying)
      this.$store.commit('setClicker', dataFromDb.clicker.nom)
    });
  }
}
</script>
