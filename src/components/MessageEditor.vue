<script setup lang="ts">
// 引入必要的模块和类型
import { defineModel, Ref } from "vue";
import { Message } from "../types/message";

// 定义组件的 props，用于接收父组件传递的 Message 对象
const messageValue: Ref<Message | null> = defineModel<Message | null>({ required: true });

// 定义角色选择的选项
const options = [
  {
    label: '用户',
    value: 'human'
  },
  {
    label: '模型',
    value: 'gpt'
  },
  {
    label: '函数调用',
    value: 'function_call'
  },
  {
    label: '函数返回',
    value: 'observation'
  }
];
</script>

<template>
  <div class="message-editor" v-if="messageValue">
    <n-card>
      <!-- 头部区域：角色选择 -->
      <template #header>
        <div class="header-content">
          <n-h4 style="margin: 0;">角色</n-h4>
          <n-radio-group v-model:value="messageValue.role" name="radioButtonGroup">
            <n-radio-button
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
            />
          </n-radio-group>
        </div>
      </template>

      <!-- 头部额外内容的插槽 -->
      <template #header-extra>
        <slot name="header-extra"></slot>
      </template>

      <!-- 消息内容输入区域 -->
      <div class="content-input">
        <n-input
            v-model:value="messageValue.content"
            type="textarea"
            :autosize="{ minRows: 1 }"
            placeholder="请输入消息内容"
        >
        </n-input>
      </div>
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.message-editor {
  padding: 8px 16px;
  display: flex;
}

.header-content {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

.content-input {
  margin-top: 16px;
}
</style>
