<script setup lang="ts">
import {Line} from "../types/message";
import {defineModel, ref, Ref} from 'vue'
import MessageEditor from "./MessageEditor.vue";

const line_value:Ref<Line|null> = defineModel<Line|null>({required:true})

const editJson = ref(false);
const jsonStr = ref("");

const addMessage = ()=>{
  line_value.value?.messages.push({
    role:"system",
    content:""
  });
}
const addMessageIn = (index:number)=>{
  line_value.value?.messages.splice(index,0,{
    role:"system",
    content:""
  });
}
const removeMessage = (index:number)=>{
  line_value.value?.messages.splice(index,1);
}
const changeJson = (value:boolean)=>{
  if (value){
    jsonStr.value = JSON.stringify(line_value.value,null,4);
  }
}
const copyJsonData=()=>{
  navigator.clipboard.writeText(JSON.stringify(line_value.value,null,0));
  window.$message.success('JSON复制成功');
}
const copyMessage = (index:number)=>{
  line_value.value?.messages.splice(index,0,line_value.value?.messages[index]);
}
const applyJsonStr = ()=>{
  if(line_value.value){
    Object.assign(line_value.value,JSON.parse(jsonStr.value));
  }
  editJson.value = false;
}
</script>

<template>
  <div class="line-editor">
    <template v-if="line_value">
      <div class="line-editor-content">
        <div class="line-editor-json-choicer">
          <div>
            <slot></slot>
          </div>
          <n-flex>
            <n-button size="tiny" @click="copyJsonData">
              复制JSON
            </n-button>
            <n-p style="margin: 0;">
              编辑JSON
            </n-p>
            <n-switch v-model:value="editJson" @update:value="changeJson"></n-switch>
          </n-flex>
        </div>
        <n-collapse-transition class="line-editor-content-editor" :show="!editJson">
          <n-scrollbar style="padding-top: 16px;max-height: calc(100vh - 4rem - 64px)">
            <div v-for="(message,index) in line_value.messages">
              <div v-if="index===0" style="margin: 8px 16px ">
                <n-button type="primary" style="width: 100%;" @click="addMessageIn(index)" >添加对话</n-button>
              </div>
              <div v-if="index>0" style="margin: -8px 64px;position: relative;z-index: 999 ">
                <n-button type="primary" style="width: 100%;" @click="addMessageIn(index)" >插入对话</n-button>
              </div>
              <message-editor  v-model="line_value.messages[index]">
                <template #header-extra>
                  <n-flex :wrap="false">
                    <n-button size="tiny" @click="copyMessage(index)"> 复制 </n-button>
                    <n-popconfirm :show-icon="false" @positive-click="removeMessage(index)">
                      <template #trigger>
                        <n-button size="tiny" > ✕ </n-button>
                      </template>
                      确认删除？
                    </n-popconfirm>
                  </n-flex>
                </template>
              </message-editor>
            </div>
            <div style="margin: 8px 16px ">
              <n-button type="primary" style="width: 100%;" @click="addMessage" >添加对话</n-button>
            </div>
          </n-scrollbar>
        </n-collapse-transition>
        <n-collapse-transition class="line-editor-json-editor" :show="editJson">
          <div style="padding: 16px">
            <n-scrollbar style="height: calc(100vh - 4rem - 64px - 48px);">
              <n-input type="textarea" style="" v-model:value="jsonStr" :autosize="true">
              </n-input>
            </n-scrollbar>
            <n-button type="primary" style="margin-top: 8px;" @click="applyJsonStr">应用</n-button>
          </div>
        </n-collapse-transition>
      </div>
    </template>
    <template v-else>
      <div class="line-editor-empty">
        <n-alert title="提示" type="info">
          请先从左侧选择一个对话。
        </n-alert>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.line-editor{
  width: 100%;
  height: calc(100vh - 4rem);
}
.line-editor-empty{
  width: 100%;
  height: calc(100vh - 4rem);
  display: flex;
  justify-content: center;
  align-items: center;

}
.line-editor-json-choicer{
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  justify-content: space-between;
  column-gap: 8px;
  height: 24px;
  padding-top: 8px;
}
</style>