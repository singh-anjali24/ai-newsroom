#!/bin/bash
cd /home/azureuser/ai-newsroom/agent

# Run pipeline through OpenClaw agent runtime
openclaw agent --agent main --local --message '/fetch-news' --timeout 120 >> agent.log 2>&1

# Send Telegram notification + health check
/usr/bin/node notify-only.js >> agent.log 2>&1

# Rotate logs
tail -500 agent.log > agent.log.tmp && mv agent.log.tmp agent.log
