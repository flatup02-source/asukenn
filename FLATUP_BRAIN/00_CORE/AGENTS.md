# AGENTS.md

## Project Name
FLATUP GYM openQLOW Internal Business AI

## Mission
Create an internal business-support AI for FLATUP GYM.
The AI should help the owner manage daily operations, customer follow-up, trial lessons, new members, review requests, and business tasks.

## Do Not Build
Do not build a fully autonomous customer reply bot.
Do not build a system that sends customer messages without human approval.
Do not build a complex dashboard before the daily interview and Obsidian logging works.

## Required MVP
Build the smallest working version that can:
1. Ask the owner daily questions
2. Receive answers
3. Convert answers into structured Markdown
4. Save Markdown files into Obsidian folders
5. Create a follow-up queue
6. Create top 3 daily tasks
7. Draft LINE replies for human review

## Preferred Stack
Use the existing environment where possible.
Possible components:
- Python / Flask
- LINE webhook
- Obsidian vault as file-based memory
- Markdown files
- Cron or systemd timer
- OpenRouter / Claude / GPT model routing
- Git for version control
Avoid unnecessary heavy frameworks unless required.

## File Writing Rules
When saving logs, use this format:
YYYY-MM-DD_daily_log.md

Each daily log must include:
- Date
- Trial lessons
- New members
- Follow-up needed
- Review request candidates
- Cancellation risk
- Important customer notes
- Today's top 3 actions
- Human approval required
- AI suggestions

## Safety Rules
Before writing code:
- Inspect existing files
- Do not delete existing files
- Do not overwrite without backup
- Add comments where behavior is risky
- Keep secrets out of Git
- Use environment variables for API keys

Before making automation:
- Make it review-first
- Add dry-run mode
- Add logs
- Add kill switch

## Output Style
When reporting progress:
- Explain what changed
- Explain where files were created
- Explain how to test
- Explain what remains incomplete
