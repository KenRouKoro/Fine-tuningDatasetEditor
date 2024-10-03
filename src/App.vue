<script setup lang="ts">
import {storeToRefs} from "pinia";
import {common_store} from "./store/common.ts";
import themeOverrides from "./overwrite.ts";
import { ref} from "vue";
import {Line} from "./types/message";
import {dateZhCN, UploadCustomRequestOptions, zhCN} from "naive-ui";
import LineEditor from "./components/LineEditor.vue";
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import GlobalMessage from "./components/GlobalMessage.vue";

const commonStore = common_store();

const common = storeToRefs(commonStore);


const editLine = ref<Line|null>(null);
const split_value = ref<number>();
const choiceIndex = ref<number>(0);
const showInput = ref(false);
const inputStr = ref("");


const customRequest = ({
                         file,
                         onFinish,
                         onError
                       }: UploadCustomRequestOptions) => {
  const reader = new FileReader()
  reader.onload = () => {
    window.$message.success('文件读取完成')
    inputStr.value = reader.result as string
    onFinish()
  }
  reader.onerror = () => {
    window.$message.error('文件读取失败')
    onError()
  }
  reader.readAsText(file.file as Blob)
}
const inputByStr = (str:string)=>{
  common.edit_message.value.length = 0;
  const lines = str.split('\n');
  lines.forEach((line)=>{
    common.edit_message.value.push({
      messages: JSON.parse(line).messages
    });
  })
  showInput.value = false;
}
const downloadText = (fileName, text) =>{
  const url = window.URL || window.webkitURL || window;
  const blob = new Blob([text]);
  const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  saveLink.href = url.createObjectURL(blob);
  saveLink.download = fileName;
  saveLink.click();
}
const download = ()=>{
  let jsonLStr = "";
  for (let i = 0;i < common.edit_message.value.length;i++){
    jsonLStr = jsonLStr + JSON.stringify(common.edit_message.value[i],null,0);
    jsonLStr = jsonLStr + "\n";
  }
  downloadText("out.jsonl",jsonLStr.trim('\n'));
  window.$message.success('成功导出');
}
const addLine = ()=>{
  common.edit_message.value.push({
    messages:[]
  });
}
const removeLine = (index)=>{
  common.edit_message.value.splice(index,1);
}
const choiceLine = (index)=>{
  choiceIndex.value = index;
  editLine.value = common.edit_message.value[index];
}
const removeAll = ()=>{
  common.edit_message.value.length = 0;
  editLine.value = null;
}
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="common.naiveTheme.value" :theme-overrides="themeOverrides">
    <n-global-style></n-global-style>
    <n-message-provider>
      <global-message></global-message>
      <n-modal-provider>
        <n-element>
          <div class="header">
            <div class = " header-item header-left">
              <n-avatar size="large" src="icon.svg" color="rgba(0,0,0,0)"/>
              <n-h1 style="margin: 0">
                Fine-tuning Dataset Editor
              </n-h1>
            </div>
            <div class = "header-item header-center">
            </div>
            <div class = "header-item header-right">
              <n-button @click="showInput=true"> 导入 </n-button>
              <n-button @click="download"> 导出 </n-button>
              <n-popconfirm :show-icon="false" @positive-click="removeAll">
                <template #trigger>
                  <n-button type="error"> 清空 </n-button>
                </template>
                确认清空所有对话？
              </n-popconfirm>
              <n-switch :value="common.isDark" @click="commonStore.changeTheme()"></n-switch>
            </div>
          </div>

          <div class="content">
            <n-split v-model:size="split_value" class="split" direction="horizontal" :max="0.5" min="150px" default-size="300px">
              <template #1>
                <div style="margin: 16px">
                  <n-h3 style="margin: 0;">
                    对话列表
                  </n-h3>
                </div>
                <n-scrollbar class="content-left" style="height: calc(100vh - 4rem - 68px);">
                  <n-list hoverable bordered clickable>
                    <n-list-item v-for="(line,index) in common.edit_message.value" @click="choiceLine(index)">
                      <n-h4 style="margin: 0;">
                        对话{{index + 1}}
                      </n-h4>
                      <template #suffix>
                        <n-popconfirm :show-icon="false" @positive-click="removeLine(index)">
                          <template #trigger>
                            <n-button size="tiny" > ✕ </n-button>
                          </template>
                          确认删除"对话{{index+1}}"？
                        </n-popconfirm>
                      </template>
                    </n-list-item>
                  </n-list>
                  <div style="margin: 16px">
                    <n-button style="width: 100%;" @click="addLine()">新建</n-button>
                  </div>
                </n-scrollbar>
              </template>
              <template #2>
                <n-scrollbar class="content-right">
                  <LineEditor v-model="editLine">
                    <n-h3 style="margin: 0;">
                      对话{{choiceIndex+1}}
                    </n-h3>
                  </LineEditor>
                </n-scrollbar>
              </template>

            </n-split>
          </div>

        </n-element>
        <n-modal v-model:show="showInput">
          <n-card title="导入" style="width: 600px;" size="huge" aria-modal="true" role="dialog" closable @close="showInput=false">
            <n-input v-model:value="inputStr" placeholder="粘贴数据集文本到此" type="textarea" :autosize="{minRows:5,maxRows:10}">
            </n-input>
            <n-divider>
              或
            </n-divider>
            <n-upload
                directory-dnd
                :max="1"
                :custom-request="customRequest"
            >
              <n-upload-dragger>
                <div style="margin-bottom: 12px">
                  <n-icon size="48" :depth="3">
                    <ArchiveIcon />
                  </n-icon>
                </div>
                <n-text style="font-size: 16px">
                  点击或者拖动文件到该区域来上传
                </n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">
                  请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
                </n-p>
              </n-upload-dragger>
            </n-upload>
            <template #action>
              <n-button @click="inputByStr(inputStr)" type="primary">
                确认
              </n-button>
            </template>
          </n-card>
        </n-modal>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped lang="scss">

.header{
  background-color: var(--card-color);
  display: flex;
  justify-content: space-between;
  height: calc(4rem - 1px);
  align-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--border-color);
  .header-item{
    display: flex;
    align-items: center;
    column-gap: 8px;
  }
}
.content{
  min-height: calc(100vh - 4rem);
  width: 100%;
  .split{
    min-height: calc(100vh - 4rem);
  }
}
.content-left{

}

</style>
