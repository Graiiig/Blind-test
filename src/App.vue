<template>
  <router-view></router-view>
</template>
<script>
import {db, onValue, ref} from "@/assets/js/firebase";

export default {
  created : function(){
    // Fonctionnel - Commenté pour l'instant car coûte des calls API (50 gratuits par heure)
    // Choisit une image sur le thème de la musique au hasard dans la base de données unsplash
    // Et la met en fond d'écran de l'app
    // let url = 'https://api.unsplash.com/photos/random?client_id=' + import.meta.env.VITE_UNSPLASH_CLIENT_ID + '&query=music&orientation=landscape'
    // fetch(url)
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(data => {
    //         document.querySelector('#app').style.backgroundImage = "url(" + data.urls.full + ")";
    //     })
    // document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1466428996289-fb355538da1b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2OTU&ixlib=rb-1.2.1&q=80')";
    // document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1501612780327-45045538702b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2Mzc&ixlib=rb-1.2.1&q=80')";
    // Pour l'instant, on met une image en dur en background
    document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1501612780327-45045538702b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2Mzc&ixlib=rb-1.2.1&q=80')";



  }
}
</script>
