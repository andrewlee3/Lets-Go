#!/bin/bash
# Consistency Check Hook for AIDLC Documents
# Triggered after fs_write to aidlc-docs/ directory

# Read hook event from stdin
EVENT=$(cat)

# Extract file path from tool_input
FILE_PATH=$(echo "$EVENT" | jq -r '.tool_input.path // empty')

# Only check files in aidlc-docs directory
if [[ ! "$FILE_PATH" =~ aidlc-docs/ ]]; then
    exit 0
fi

# Skip audit.md and state files (these are logs, not content)
if [[ "$FILE_PATH" =~ audit\.md$ ]] || [[ "$FILE_PATH" =~ aidlc-state\.md$ ]]; then
    exit 0
fi

# Output consistency check reminder to stderr (shown to LLM)
cat << 'EOF'

---
📋 CONSISTENCY CHECK REQUIRED

Document updated: The file has been modified.

Before proceeding, verify:
1. ✅ All content traces back to source documents (requirements, PRD, QnA decisions)
2. ✅ No assumptions or features added beyond source specifications  
3. ✅ No duplicate or redundant items
4. ⚠️ If discrepancies found, fix before asking for user approval

Source documents to cross-reference:
- requirements/table-order-requirements.md (PRD)
- aidlc-docs/inception/requirements/requirements.md
- aidlc-docs/backlog.md (MVP excluded items)
- QnA decisions in clarification-questions.md or audit.md
---

EOF

exit 0
