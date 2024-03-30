# OpenAI 助手API

## 添加依赖库

```bash
go get github.com/Azure/azure-sdk-for-go
```

## 创建一个client

```go
func newClient(args newClientArgs) *azopenaiassistants.Client {
	opts := &azopenaiassistants.ClientOptions{
		ClientOptions: policy.ClientOptions{
			Logging: policy.LogOptions{
				IncludeBody: true,
			},
		},
	}

	if args.Azure {
		if args.UseIdentity {
			dac, err := azidentity.NewDefaultAzureCredential(nil)
			tmpClient, err := azopenaiassistants.NewClient(tv.AOAIEndpoint, dac, opts)
			return tmpClient
		} else {
			tmpClient, err := azopenaiassistants.NewClientWithKeyCredential(tv.AOAIEndpoint, azcore.NewKeyCredential(tv.AOAIKey), opts)
			return tmpClient
		}
	} else {
		tmpClient, err := azopenaiassistants.NewClientForOpenAI(tv.OpenAIEndpoint, azcore.NewKeyCredential(tv.OpenAIKey), opts)
		return tmpClient
	}
}
```

## 上传一个文件

```go
uploadResp, err := client.UploadFile(context.Background(), bytes.NewReader([]byte("hello world")), assistants.FilePurposeAssistants, &assistants.UploadFileOptions{
    Filename: to.Ptr("a.txt"),
})
```

## 创建一个assistant

```go
assistantName := "test-thread-run"
deploymentName := "gpt-4-1106-preview"

var fileIDs []string
if uploadResp.ID != "" {
	fileIDs = append(fileIDs, uploadResp.ID)
}

createAssistantResp, err := c.cli.CreateAssistant(ctx, assistants.AssistantCreationBody{
	Name:           to.Ptr(assistantName),
	DeploymentName: to.Ptr(c.opt.DeploymentName),
	Description:    to.Ptr(description),
	Instructions:   to.Ptr(instructions),
	FileIDs:        fileIDs,
	Tools: []assistants.ToolDefinitionClassification{
		&assistants.CodeInterpreterToolDefinition{},
		//&assistants.RetrievalToolDefinition{},
	},
}, nil)
```

需要把文件ID注入进去，不然的话，就会出现如下这些回答：

>- Assistant: I currently do not have access to the file you uploaded. Could you provide some details about what you're selling or any specific questions you have in mind?  
>- Assistant: I currently don't have the ability to directly access the contents of the file you uploaded. However, if you can provide some details or specific questions about the than happy to assist you in finding the information you need.  
>- Assistant: I currently don't have visibility into the specific contents of the file you've uploaded. Could you provide more details about the file or its contents so that I can assist you further?  
>- Assistant: I see you've uploaded a file. How can I assist you with it?

## 创建一个thread(会话)

```go
createThreadResp, err := client.CreateThread(context.Background(), assistants.AssistantThreadCreationOptions{}, nil)
```

## 添加一个message

```go
threadID := createThreadResp.ID
messageResp, err := client.CreateMessage(context.Background(), *threadID, assistants.CreateMessageBody{
    Content: to.Ptr("How many ears does a dog usually have?"),
    Role:    to.Ptr(assistants.MessageRoleUser),
    FileIDs: []string{
        *uploadResp.ID,
    },
}, nil)
```

## run这个助手

```go
createRunResp, err := client.CreateRun(context.Background(), *createThreadResp.ID, assistants.CreateRunBody{
    AssistantID:  createAssistantResp.ID,
    Instructions: to.Ptr("This user is known to be sad, please be kind"),
}, nil)
```

## 检查是否run完成

```go
runID := *createRunResp.ID
var lastGetRunResp assistants.GetRunResponse

for {
    var err error
    lastGetRunResp, err = client.GetRun(context.Background(), *createThreadResp.ID, runID, nil)

    if *lastGetRunResp.Status != assistants.RunStatusQueued && *lastGetRunResp.Status != assistants.RunStatusInProgress {
        break
    }

    time.Sleep(500 * time.Millisecond)
}
```

## 获取助手的回答

```go
var lastResponses []assistants.ThreadMessage

listMessagesPager := client.NewListMessagesPager(*createThreadResp.ID, &assistants.ListMessagesOptions{
    After: lastMessageID,
    Order: to.Ptr(assistants.ListSortOrderAscending),
})

for listMessagesPager.More() {
    page, err := listMessagesPager.NextPage(context.Background())

    lastResponses = page.Data
}
```

## 参考资料

- [OpenAI Assistants API Tutorial](https://www.datacamp.com/tutorial/open-ai-assistants-api-tutorial)
- [How to create Assistants with Azure OpenAI Service — Azure OpenAI | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/assistant#assistants-support)
- [Getting Started With Azure OpenAI Assistant API](https://shweta-lodha.medium.com/getting-started-with-azure-openai-assistant-api-1a26749578b3)
- [Build Chatbot using OpenAI's Latest Assistants API - A Beginner's Guide | Code](https://www.youtube.com/watch?v=yo0qy7xyd3A)
- [A look at the Azure OpenAI Assistants API](https://blog.baeke.info/2024/02/08/a-look-at-the-azure-openai-assistants-api/)
- [Fast chat bot creation with the OpenAI Assistants API and the Microsoft Bot Framework SDK](https://blog.baeke.info/2024/02/11/fast-chat-bot-creation-with-the-openai-assistants-api-and-the-microsoft-bot-framework-sdk/)
- [对OpenAI的ChatGPT大模型进行微调](https://www.eula.club/blogs/%E5%AF%B9OpenAI%E7%9A%84ChatGPT%E5%A4%A7%E6%A8%A1%E5%9E%8B%E8%BF%9B%E8%A1%8C%E5%BE%AE%E8%B0%83.html#_1-%E5%89%8D%E8%A8%80)
- [LlamaIndex](https://github.com/run-llama/llama_index)
- [ChatGPT Assistants API 初探](https://medium.com/%E8%BB%9F%E9%AB%94%E9%96%8B%E7%99%BC/chatgpt-assistants-api-%E5%88%9D%E6%8E%A2-7bec8ac373ec)
- [ChatGPT Assistants API 實踐 架空海線鐵路站點 查詢](https://medium.com/ai-%E4%BA%BA%E6%A9%9F%E5%8D%94%E4%BD%9C/chatgpt-assistants-api-%E4%B8%B2%E6%8E%A5-line-message-api-%E5%AF%A6%E8%B8%90-%E6%9E%B6%E7%A9%BA%E6%B5%B7%E7%B7%9A%E9%90%B5%E8%B7%AF%E7%AB%99%E9%BB%9E-%E6%9F%A5%E8%A9%A2-c90f3d5f789a)
- [Functions with OpenAI Assistant API](https://tmmtt.medium.com/functions-with-openai-assistant-api-47e1481a0b42)
- [What Are OpenAI Assistant Function Tools Exactly?](https://cobusgreyling.medium.com/what-are-openai-assistant-function-tools-exactly-06ef8e39b7bd)
