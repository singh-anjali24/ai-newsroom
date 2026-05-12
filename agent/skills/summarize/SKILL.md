---
name: summarize
description: Summarize a given text using the AI summarizer agent powered by Ollama Cloud.
user-invocable: true
---

You MUST use the exec tool to run this exact command. Do NOT read files. Do NOT write code. Just execute:

node /home/azureuser/ai-newsroom/agent/run-summarize.js "TEXT_FROM_USER"

Replace TEXT_FROM_USER with the text the user wants summarized. Then report the summary to the user.
