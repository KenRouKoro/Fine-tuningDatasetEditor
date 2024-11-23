<script setup lang="ts">
import {defineModel, Ref} from "vue";
import { Message} from "../types/message";

const message_value:Ref<Message|null> = defineModel<Message|null>({required:true})

const options=[
  {
    label:'系统',
    value:'system'
  },
  {
    label:'模型',
    value:'assistant'
  },
  {
    label:'用户',
    value:'user'
  },
];
</script>

<template>
<div class="message-editor" v-if="message_value">
  <n-card>
    <template #header>
      <div style="display: flex;align-items: center;  column-gap: 8px;">
        <n-h4 style="margin: 0;">角色</n-h4>
        <n-radio-group v-model:value="message_value.role" name="radiobuttongroup1">
          <n-radio-button
              v-for="song in options"
              :key="song.value"
              :value="song.value"
              :label="song.label"
          />
        </n-radio-group>
        <!--
        <n-select style="width: 150px;" v-model:value="message_value.role" :options="options"></n-select>
        -->
      </div>
    </template>
    <template #header-extra>
      <slot name="header-extra"></slot>
    </template>
    <div>
      <n-input v-model:value="message_value.content" type="textarea" :autosize="{minRows:1}">
      </n-input>
    </div>
  </n-card>
</div>
</template>

<style scoped lang="scss">
.message-editor{
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
}
</style>