import { defineStore } from 'pinia'
import {darkTheme, lightTheme, useOsTheme} from "naive-ui";
import {Line} from "../types/message";

interface CommonState {
  theme : string,
  edit_message:Line[],
}

export const common_store = defineStore('de_common', {
  state:(): CommonState =>{
    return {
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",
      edit_message:[],
    }
  },
  getters: {
    naiveTheme:(state)  =>{
      if(state.theme==="light"){
        return lightTheme;
      }else{
        return darkTheme;
      }
    },
    isDark:(state):boolean=>{
      return state.theme==="dark";
    }
  },
  actions: {
    changeTheme(){
      if (this.isDark){
        this.theme='light';
      }else{
        this.theme='dark';
      }
    }
  },
  persist: {
    paths: ['theme'],
  },
})