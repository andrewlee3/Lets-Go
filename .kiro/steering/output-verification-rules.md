# Output Verification Rules

## MANDATORY: Always Verify Output Against Source Documents

### Rule 1: Document-Based Output Verification

**CRITICAL**: After generating ANY output (requirements, design, code, etc.), you MUST perform verification against source documents.

#### Verification Process (MANDATORY at end of each stage):

1. **List Source Documents**: Identify all documents used as input
   - Requirements files
   - Design documents
   - User answers to questions
   - Previous stage artifacts

2. **Compare Output vs. Source**: 
   - Check each requirement/feature in output
   - Verify it exists in source documents
   - Confirm details match source specifications
   - Flag any discrepancies

3. **Create Verification Report**:
   ```markdown
   ## Output Verification Report
   
   ### Source Documents Reviewed:
   - [List all source documents]
   
   ### Verification Results:
   - ✅ [Feature/Requirement]: Matches [source document, section X]
   - ✅ [Feature/Requirement]: Matches [source document, section Y]
   - ⚠️ [Feature/Requirement]: Partially matches [source], missing [detail]
   - ❌ [Feature/Requirement]: Not found in source documents
   
   ### Discrepancies Found:
   - [List any mismatches or missing items]
   
   ### Confirmation:
   - [ ] All output items traced to source documents
   - [ ] No assumptions made beyond source documents
   ```

4. **Present to User**: Show verification report before asking for approval

#### When to Verify:
- ✅ After generating requirements document
- ✅ After generating design documents
- ✅ After generating code
- ✅ After generating any artifact that should match source specifications

---

## Rule 2: No Assumptions - Document-Only Approach

**CRITICAL**: NEVER add features, requirements, or details that are not explicitly stated in source documents.

### Prohibited Actions:
- ❌ Adding "nice to have" features not in requirements
- ❌ Assuming technical details not specified
- ❌ Inferring user preferences without asking
- ❌ Adding "best practices" not requested
- ❌ Expanding scope beyond stated requirements

### Required Actions:
- ✅ Only implement what is explicitly documented
- ✅ Ask questions when details are unclear
- ✅ Flag missing information instead of assuming
- ✅ Stick strictly to provided specifications
- ✅ If something is ambiguous, create clarification questions

### Example - WRONG:
```
User requirement: "Create login page"
AI output: "Created login page with password reset, remember me, 
social login, and two-factor authentication"
❌ Added features not in requirements
```

### Example - CORRECT:
```
User requirement: "Create login page"
AI output: "Created login page with username and password fields.
Note: The following were not specified in requirements:
- Password reset functionality
- Remember me option
- Social login
Should these be included?"
✅ Only implemented what was specified, asked about unclear items
```

---

## Integration with AI-DLC Workflow

### Modified Approval Flow:

**OLD**:
1. Generate output
2. Ask for approval
3. Proceed

**NEW**:
1. Generate output
2. **Perform verification against source documents**
3. **Present verification report**
4. Ask for approval
5. Proceed

### Verification Report Location:
- Save in same directory as the output artifact
- Filename: `{artifact-name}-verification-report.md`
- Example: `requirements-verification-report.md`

---

## Enforcement

- This rule applies to ALL stages of AI-DLC workflow
- Verification is MANDATORY, not optional
- User approval required after seeing verification report
- If discrepancies found, fix before proceeding
