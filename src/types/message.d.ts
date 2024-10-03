//单个消息
export type Message = {
    /**
     * 角色
     */
    role: "system"|"assistant"|"user",
    /**
     * 内容
     */
    content: string
}
//一行消息
export type Line = {
    /**
     * 消息
     */
    messages:Message[]
}