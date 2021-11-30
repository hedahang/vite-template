<template>
  <div class="test">13131231</div>
</template>
<script lang="ts">
export default {
  name: "testIndex"
};
</script>
<script setup lang="ts">
import { onBeforeMount, onActivated, onDeactivated } from "vue";
console.log("create");
onBeforeMount(() => {
  console.log(12312);
});
onActivated(() => {
  console.log("onActivated");
});
onDeactivated(() => {
  console.log("onDeactivated");
});
</script>

<style lang="scss" scoped>
.test {
  width: 200px;
  height: 200px;
  background-color: aquamarine;
}
</style>
