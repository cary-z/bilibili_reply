<template>
  <div class="main_app p-1">
    <ReplyForm />
    <ReplyContent />
  </div>
</template>

<script lang="ts" setup>
import ReplyForm from "./ReplyForm.vue";
import ReplyContent from "./ReplyContent.vue";
</script>

<style scoped>
.main_app {
  width: 600px;
}
</style>
