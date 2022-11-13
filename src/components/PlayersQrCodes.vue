<script setup>
  import QrcodeVue from 'qrcode.vue'
</script>
<script>
export default {
  computed:{
    getUrl(){
      let getUrl = window.location;
      return getUrl.protocol + "//" + getUrl.host + "/";

    },
    getShowModalPlayersQrcodes(){
      return this.$store.getters.getShowModalPlayersQrcodes;
    },
    setShowModalPlayersQrcodes() {
      this.$store.commit('setShowModalPlayersQrcodes', !this.$store.getters.getShowModalPlayersQrcodes)
    },
    getUsers(){
      return this.$store.getters.getUsers;
    },
    getGoogleUid() {
    return this.$store.getters.getGoogleUid;
  }
  }
}
</script>
<template>
  <div class="flex qrcodeMenu"
  v-if="getShowModalPlayersQrcodes">
    <div>
    <span class="pointer" style="float: right" @click="setShowModalPlayersQrcodes">
      <font-awesome-icon icon="fa-solid fa-circle-xmark"/></span>
    </div>
    <h1 style="text-align: center">Connexion</h1>

    <div class="flex space-around" style="flex-wrap: wrap; margin-top: 2vh; overflow-y:scroll;">
      <div v-for="user in getUsers" class="flex" style="flex-direction: column; margin-left: 3vw; margin-top: 2vh">
        <qrcode-vue :value="getUrl + 'buzzer/' + getGoogleUid + '/' + user.username" :size="300" level="H" :background="'#'+Math.floor(Math.random() * 16777215).toString(16)"
                    :foreground="'#'+Math.floor(Math.random() * 16777215).toString(16)"/>
        <a :href="getUrl + getGoogleUid + '/' + user.username">{{user.username}}</a>
      </div>
    </div>
  </div>
</template>
