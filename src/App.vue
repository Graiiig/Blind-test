<template>
  <router-view></router-view>
</template>
<script>
export default {
  created : function(){
    document.querySelector('#app').style.backgroundImage = "url('https://images.unsplash.com/photo-1466428996289-fb355538da1b?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNDg3OTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTg1OTQ2OTU&ixlib=rb-1.2.1&q=80')";
  }
}
</script>
