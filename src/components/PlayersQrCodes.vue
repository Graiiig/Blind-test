<script setup>
  import QrcodeVue from 'qrcode.vue'
</script>
<script>
export default {
  computed:{
    getUrl(){
      let getUrl = window.location;
      return getUrl.protocol + "//" + getUrl.host + "/";

    }
  }
}
</script>
<template>
  <div class=" " style="
  position: fixed;
  z-index: 999;
  top: 10vh;
  left: 10vw;
  width: 80%;
  height: 80vh;
  padding: 2vh;
  border-radius: 5%;
  display: flex;
  justify-content: space-around;
  background-color: #111436;
">
    <div v-for="(user, key) in this.$store.getters.getUsers" class="" >
      <qrcode-vue :value="getUrl+user.username" :size="size" level="H"/>
      <p>{{user.username}}</p>
    </div>
  </div>
</template>
