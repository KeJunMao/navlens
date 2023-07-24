<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: {
      type: String,
    },
    class: {
      type: String,
    },
  },
  computed: {
    iconName() {
      return this.name?.startsWith("i-")
        ? this.name?.replace(/^i-/, "")
        : this.name;
    },
    isAvatar() {
      return this.name?.startsWith("http");
    },
  },
});
</script>
<template>
  <template v-if="name && name.length > 7">
    <UAvatar
      class="w-[1em] h-[1em]"
      :class="class"
      v-if="isAvatar"
      :src="name"
      :alt="name"
    ></UAvatar>
    <Icon :class="class" v-else :name="iconName">
      <template></template>
    </Icon>
  </template>
</template>
