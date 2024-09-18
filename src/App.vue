<script setup>

  import HeaderMain from './components/HeaderMain.vue';
  import FooterMain from './components/FooterMain.vue';
  import ApartmentList from './components/ApartmentList.vue';
  
</script>

<template>
  <HeaderMain/>
  <router-view></router-view>
  <FooterMain />
</template>

<style lang="scss">
  @use './styles/general.scss';

#app {
  cursor: url('...'), auto; /* Magari potremmo crearne uno personalizzato?.. */
}

</style>
