你是一个全栈工程师，你现在需要开发一个名为Cheatsheet Maker的产品。

产品功能：
* 可以上传pdf，或者给一个链接
* 把给定的文章转成格式化的要点，并提供翻译功能，用户可自行决定最后的是英文还是中文
* 然后把要点做成Cheatsheet，Cheatsheet为html格式，采用tailwindcss, 要求背景是白色的，每个要点做成一张卡片形式，采用tailwindcss，要求符合现代设计，央视美观，色彩丰富，结构合理。能兼容电脑端和移动端
* 给html页面提供预览窗口，并提供导出png功能，可选择电脑端查看（横屏图）和移动端分享需求（竖屏图））。

注意事项：
* 产品的AI能力来自于第三方，请预留API_URL和API_TOKEN的配置
* 长和宽比例限制：不要太长，也不要太宽。长宽比例在3:4至2:1之间
* 不要超过一页A4纸能打印的范围

翻译和AI能力来源：
* 采用silliconflow的DeepSeek api，具体api文档参考这里（https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions），模型使用moonshotai/Kimi-K2-Thinking。
* api_token为:{替换为自己的API TOKEN} 。请将其配置到环境变量里。

部署到：
* 从github 仓库 。github地址：https://github.com/orange90/cheatsheet_maker。目前是空repo的状态，你在确认项目成功运行之后，将改动将提交到这里，提交前请让我确认
* 部署到Vercel。和上述github仓库做CI/CD，仓库变动，则vercel应用rebuild

