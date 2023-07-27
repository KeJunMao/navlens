<script lang="ts" setup>
import { QRCodeSegment, QRCodeToDataURLOptions } from "qrcode";
import QRcode from "qrcode";

const props = defineProps<{
  text: string | QRCodeSegment[];
  options?: QRCodeToDataURLOptions;
}>();

const qrcode = asyncComputed(
  async () => await QRcode.toDataURL(props.text, props.options)
);
</script>

<template>
  <img v-if="text" :src="qrcode" :alt="(text as string)" />
  <template v-else>{{ text }}</template>
</template>
