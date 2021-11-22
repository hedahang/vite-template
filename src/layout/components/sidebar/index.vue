<template>
  <div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storageLocal } from "/@/utils/storage";
import Logo from "./logo.vue";
const showLogo = ref(storageLocal.getItem("logoVal") || "1");
</script>

<style scoped></style>
