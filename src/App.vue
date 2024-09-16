<script setup>
import ApartmentList from './components/ApartmentList.vue';
import MainHeader from './components/MainHeader.vue';
import SearchBar from './components/SearchBar.vue';  
</script>

<template>
  <MainHeader />
  <SearchBar></SearchBar>
  <router-view></router-view>
  <FooterMain />
</template>

<style lang="scss">
@use './styles/general.scss';

</style>
