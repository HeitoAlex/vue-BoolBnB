<script setup>

  import ProjectList from './components/ProjectList.vue';
  import MainHeader from './components/MainHeader.vue';
  
</script>

<template>
  <MainHeader/>
  <router-view></router-view>
</template>

<style lang="scss">
  @use './styles/general.scss';

</style>
