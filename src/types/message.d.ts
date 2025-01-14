/**
 * 单个消息的类型定义
 */
export type Message = {
    /**
     * 角色
     */
    role: "gpt" | "human" | "function_call" | "observation",
    /**
     * 内容
     */
    content: string
}

/**
 * 一行消息的类型定义
 */
export type Line = {
    /**
     * 消息数组
     */
    messages: Message[],
    /**
     *  消息备注
     */
    info: string,
    tools: string,
    system: string
}
