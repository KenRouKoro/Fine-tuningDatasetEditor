import { defineStore } from 'pinia';
import { darkTheme, lightTheme } from "naive-ui";
import { Line } from "../types/message";

/**
 * 定义公共状态的接口
 */
interface CommonState {
  /**
   * 当前主题，'light' 或 'dark'
   */
  theme: string,
  /**
   * 编辑中的消息数组
   */
  editMessage: Line[],
  /**
   * 文件名
   */
  filename: string,
  /**
   * 应用内剪切板
   */
  clipboard: string,
}

/**
 * 定义 Pinia 的 store，用于管理公共状态
 */
export const useCommonStore = defineStore('de_common', {
  state: (): CommonState => ({
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    editMessage: [],
    filename: "out",
    clipboard: "",
  }),
  getters: {
    /**
     * 获取 Naive UI 主题对象
     */
    naiveTheme: (state) => {
      return state.theme === "light" ? lightTheme : darkTheme;
    },
    /**
     * 判断当前是否为深色主题
     */
    isDark: (state): boolean => {
      return state.theme === "dark";
    }
  },
  actions: {
    /**
     * 切换主题，从深色切换到浅色，或反之
     */
    changeTheme() {
      this.theme = this.isDark ? 'light' : 'dark';
    }
  },
  persist: {
    paths: ['theme'], // 持久化 theme 状态
  },
});
