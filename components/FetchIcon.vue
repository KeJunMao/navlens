<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconName() {
      return this.name.startsWith("i-")
        ? this.name.replace(/^i-/, "")
        : this.name;
    },
  },
});
</script>
<template>
  <Icon :name="iconName" />
</template>
