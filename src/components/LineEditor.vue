<script setup lang="ts">
// 引入必要的模块和组件
import {defineModel, ref, Ref} from 'vue';
import {Line, Message} from "../types/message";
import MessageEditor from "./MessageEditor.vue";
import {useCommonStore} from "../store/common.ts";
import {storeToRefs} from "pinia";

const commonStore = useCommonStore();

const common = storeToRefs(commonStore);

// 定义组件的 props，用于接收父组件传递的 Line 对象
const lineValue: Ref<Line | null> = defineModel<Line | null>({ required: true });

// 定义是否处于 JSON 编辑模式的响应式变量
const editJson = ref(false);
// 存储 JSON 字符串的响应式变量
const jsonStr = ref("");

// 添加一条新的系统消息到 messages 数组的末尾
const addMessage = () => {
  lineValue.value?.messages.push({
    role: "system",
    content: ""
  });
};

// 在指定索引位置插入一条新的系统消息
const addMessageIn = (index: number) => {
  lineValue.value?.messages.splice(index, 0, {
    role: "system",
    content: ""
  });
};

// 移除指定索引位置的消息
const removeMessage = (index: number) => {
  lineValue.value?.messages.splice(index, 1);
};

// 当切换 JSON 编辑模式时，将当前 Line 对象转换为 JSON 字符串
const changeJson = (value: boolean) => {
  if (value) {
    jsonStr.value = JSON.stringify(lineValue.value, null, 4);
  }
};

// 复制当前 Line 对象的 JSON 字符串到剪贴板
const copyJsonData = () => {
  if (lineValue.value) {
    navigator.clipboard.writeText(JSON.stringify(lineValue.value, null, 0));
    window.$message.success('JSON 复制成功');
  }
};

// 复制指定索引位置的消息并插入到当前 messages 数组的末尾
const copyMessage = (index: number) => {
  const message = lineValue.value?.messages[index];
  if (message) {
    let str = JSON.stringify(message, null, 0);
    common.clipboard.value = str;
    window.$message.success('复制成功');
  }
};

// 将编辑的 JSON 字符串应用到当前 Line 对象
const applyJsonStr = () => {
  if (lineValue.value) {
    try {
      const parsed = JSON.parse(jsonStr.value);
      // 确保解析结果符合 Line 类型
      if (parsed && Array.isArray(parsed.messages)) {
        lineValue.value.messages = parsed.messages;
        lineValue.value.info = parsed.info;
        window.$message.success('JSON 应用成功');
      } else {
        throw new Error('Invalid JSON结构');
      }
    } catch (error) {
      window.$message.error(`应用 JSON 失败: ${(error as Error).message}`);
    }
  }
  editJson.value = false;
};
//剪切至剪切板
const cutToClipboard = (index: number)=>{
  const message = lineValue.value?.messages[index];
  let str = JSON.stringify(message, null, 0);
  common.clipboard.value = str;
  removeMessage(index);
  window.$message.success('剪切成功');
}
//从剪切板插入
const pasteFromClipboard = (index: number)=>{
  if (common.clipboard.value===""){
    window.$message.error('剪切板为空');
    return;
  }
  const message = JSON.parse(common.clipboard.value);
  if (index!=-1){
    lineValue.value?.messages.splice(index, 0, message);
  }else{
    lineValue.value?.messages.push(message);
  }
  window.$message.success('粘贴成功');
}
const coverFromClipboard = (index: number)=>{
  if (common.clipboard.value===""){
    window.$message.error('剪切板为空');
    return;
  }
  if (lineValue.value!=null){
    lineValue.value.messages[index] = JSON.parse(common.clipboard.value);
    window.$message.success('覆盖成功');
  }
}
const copyMessageJson = (index:number)=>{
  const message = lineValue.value?.messages[index];
  navigator.clipboard.writeText(JSON.stringify(message, null, 0));
  window.$message.success('复制Json成功');
}
</script>

<template>
  <div class="line-editor">
    <!-- 如果存在 lineValue，则显示编辑内容 -->
    <template v-if="lineValue">
      <div class="line-editor-content">
        <!-- JSON 选择器区域 -->
        <div class="line-editor-json-choicer">
          <div>
            <!-- 插槽，用于自定义内容 -->
            <slot></slot>
          </div>
          <n-flex>
            <!-- 复制 JSON 按钮 -->
            <n-button size="tiny" @click="copyJsonData">
              复制 JSON
            </n-button>
            <n-p style="margin: 0;">
              编辑 JSON
            </n-p>
            <!-- 切换到 JSON 编辑模式的开关 -->
            <n-switch v-model:value="editJson" @update:value="changeJson"></n-switch>
          </n-flex>
        </div>

        <!-- 非 JSON 编辑模式下的消息编辑器 -->
        <n-collapse-transition class="line-editor-content-editor" :show="!editJson">
          <n-scrollbar style="padding-top: 0px; max-height: calc(100vh - 4rem - 64px);">
            <!-- 遍历并渲染每一条消息 -->
            <div v-for="(message, index) in lineValue.messages" :key="index">
              <!-- 在第一条消息前添加“添加对话”按钮 -->
              <div v-if="index === 0" class="message-button" style="display:flex;">
                <n-button type="primary" style="width: 47.5%;" @click="addMessageIn(index)">
                  添加对话
                </n-button>
                <div style="width: 5%;">

                </div>
                <n-button type="info" style="width: 47.5%;" @click="pasteFromClipboard(index)">
                  在此粘贴
                </n-button>
              </div>
              <!-- 在其他消息前添加“插入对话”按钮 -->
              <div v-if="index > 0" class="message-button-insert" style="display:flex;">
                <n-button type="primary" style="width: 47.5%;" @click="addMessageIn(index)">
                  插入对话
                </n-button>
                <div style="width: 5%;">

                </div>
                <n-button type="info" style="width: 47.5%;" @click="pasteFromClipboard(index)">
                  在此粘贴
                </n-button>
              </div>
              <!-- 消息编辑器组件 -->
              <MessageEditor v-model="lineValue.messages[index]">
                <template #header-extra>
                  <n-flex :wrap="false">
                    <n-button size="tiny"@click="copyMessageJson(index)">
                      复制JSON
                    </n-button>
                    <n-button size="tiny" @click="cutToClipboard(index)">
                      剪切
                    </n-button>
                    <!-- 复制消息按钮 -->
                    <n-button size="tiny" @click="copyMessage(index)">
                      复制
                    </n-button>
                    <n-button size="tiny" @click="coverFromClipboard(index)">
                      覆盖粘贴
                    </n-button>
                    <!-- 删除消息的确认弹窗 -->
                    <n-popconfirm :show-icon="false" @positive-click="removeMessage(index)">
                      <template #trigger>
                        <n-button size="tiny">✕</n-button>
                      </template>
                      确认删除？
                    </n-popconfirm>
                  </n-flex>
                </template>
              </MessageEditor>
            </div>
            <!-- 在最后添加“添加对话”按钮 -->
            <div class="message-button" style="display:flex;">

              <n-button type="primary" style="width: 47.5%;" @click="addMessage">
                添加对话
              </n-button>
              <div style="width: 5%;">

              </div>
              <n-button type="info" style="width: 47.5%;" @click="pasteFromClipboard(-1)">
                在此粘贴
              </n-button>
            </div>
          </n-scrollbar>
        </n-collapse-transition>

        <!-- JSON 编辑模式下的编辑器 -->
        <n-collapse-transition class="line-editor-json-editor" :show="editJson">
          <div class="json-editor">
            <n-scrollbar style="height: calc(100vh - 4rem - 64px - 48px);">
              <n-input
                  type="textarea"
                  v-model:value="jsonStr"
                  :autosize="{ minRows: 1 }"
                  placeholder="请输入有效的 JSON"
              >
              </n-input>
            </n-scrollbar>
            <n-button type="primary" style="margin-top: 8px;" @click="applyJsonStr">
              应用
            </n-button>
          </div>
        </n-collapse-transition>
      </div>
    </template>

    <!-- 如果没有选择 Line，则显示提示信息 -->
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
.line-editor {
  width: 100%;
  height: calc(100vh - 4rem);
}

.line-editor-empty {
  width: 100%;
  height: calc(100vh - 4rem);
  display: flex;
  justify-content: center;
  align-items: center;
}

.line-editor-json-choicer {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background-color: var(--card-color);
  border-bottom-color: var(--border-color);
  border-bottom-style:solid;
  border-bottom-width: 1px;
}

.line-editor-content-editor {
}

.line-editor-json-editor {
}

.message-button{
  margin: 8px 16px;
}
.message-button-insert {
  margin: -4px 16px;
}

.json-editor {
  display: flex;
  flex-direction: column;
}

.json-editor n-input {
  width: 100%;
}
</style>
