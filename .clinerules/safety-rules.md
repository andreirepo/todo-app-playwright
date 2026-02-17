# CLI Safety Rules for Agentic AI

## Purpose
This file contains strict safety rules to prevent agentic AI from making dangerous modifications to the project without human oversight.

## File Modification Rules

### 🔒 CRITICAL PROTECTION RULES

#### 1. DELETION PROHIBITED
- **NEVER** delete any existing files or directories
- **NEVER** use `rm`, `del`, `rmdir`, or similar deletion commands
- **NEVER** overwrite files with empty content
- **NEVER** truncate files to zero length

#### 2. CORE FILE PROTECTION
The following files are **ABSOLUTELY PROTECTED** and cannot be modified without explicit human approval:
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file
- `playwright.config.ts` - Test configuration
- `tsconfig.json` - TypeScript configuration
- `Dockerfile` - Container configuration
- `.gitignore` - Git ignore rules
- Any `.env*` files - Environment configuration
- Any CI/CD configuration files (`.github/workflows/*`, `.gitlab-ci.yml`, etc.)

#### 3. STRUCTURE PRESERVATION
- **NEVER** rename or move existing directories
- **NEVER** rename existing files
- **NEVER** change file extensions
- **NEVER** modify file permissions or ownership

### ⚠️ MODIFICATION RESTRICTIONS

#### 4. HUMAN APPROVAL REQUIRED
The following modifications require explicit human approval before execution:
- Changes to test logic or test cases
- Modifications to page object methods
- Changes to configuration files
- Addition of new dependencies
- Changes to CI/CD pipelines
- Any modifications to production code

#### 5. SAFE MODIFICATION GUIDELINES
When modifications are permitted:
- **ALWAYS** use `replace_in_file` instead of `write_to_file` for existing files
- **ALWAYS** preserve existing formatting and structure
- **ALWAYS** include comprehensive comments for new code
- **ALWAYS** maintain backward compatibility
- **ALWAYS** follow existing code style and patterns

#### 6. NEW FILE CREATION RULES
New files may only be created if:
- They are clearly documented and justified
- They follow existing naming conventions
- They are placed in appropriate directories
- They do not duplicate existing functionality
- They include proper error handling and documentation

### 🛡️ VALIDATION REQUIREMENTS

#### 7. CHANGE VALIDATION
Before any modification:
- **VERIFY** the file exists and is the correct target
- **VALIDATE** that the change aligns with project goals
- **CONFIRM** the modification follows established patterns
- **ENSURE** the change is reversible

#### 8. TESTING REQUIREMENTS
After any modification:
- **VERIFY** the project still builds successfully
- **CONFIRM** existing tests continue to pass
- **VALIDATE** new functionality works as expected
- **DOCUMENT** any changes made for human review

### 🔐 SECURITY RULES

#### 9. SECURITY CONSTRAINTS
- **NEVER** introduce code that exposes sensitive information
- **NEVER** modify authentication or authorization logic
- **NEVER** add code that could compromise system security
- **NEVER** modify cryptographic implementations
- **NEVER** introduce code that bypasses security measures

#### 10. DATA PROTECTION
- **NEVER** modify or access user data files
- **NEVER** change database schemas or migration files
- **NEVER** modify backup or recovery procedures
- **NEVER** access configuration files containing secrets

### 📋 APPROVAL WORKFLOW

#### 11. HUMAN INTERVENTION TRIGGERS
The following actions **MUST** trigger human intervention:
- Any attempt to modify protected files
- Any attempt to delete files or directories
- Any modification that affects more than 50 lines of code
- Any change to core business logic
- Any modification that could affect system stability
- Any change to external dependencies

#### 12. ESCALATION PROCEDURES
When human intervention is required:
1. **STOP** all automated actions immediately
2. **PRESERVE** current state without making changes
3. **REQUEST** explicit human approval with detailed explanation
4. **WAIT** for explicit human confirmation before proceeding
5. **DOCUMENT** the requested change for audit trail

### 🚨 EMERGENCY PROTOCOLS

#### 13. ROLLBACK REQUIREMENTS
If a modification causes issues:
- **IMMEDIATELY** stop all automated processes
- **PRESERVE** the current state for analysis
- **NOTIFY** human operators of the issue
- **WAIT** for human intervention - do not attempt automated rollback
- **DOCUMENT** the issue and steps taken

#### 14. CONTINGENCY MEASURES
- **ALWAYS** maintain multiple backup points
- **NEVER** proceed if validation checks fail
- **ALWAYS** have a clear exit strategy for any modification
- **NEVER** make irreversible changes without human approval

### 📞 EMERGENCY CONTACTS
If you encounter any of the following scenarios, STOP and request human assistance:
- Uncertainty about file purpose or impact
- Conflicting requirements or unclear instructions
- Any modification that seems potentially harmful
- Any request that violates these safety rules

### 🔄 MANDATORY COMMIT REQUIREMENTS

#### 15. IMMEDIATE COMMIT POLICY
**EVERY** file modification **MUST** be followed by an immediate git commit with the following requirements:

**Commit Timing:**
- **ALWAYS** commit immediately after each file modification
- **NEVER** batch multiple file changes into a single commit
- **NEVER** proceed with additional modifications until the previous commit is complete
- **ALWAYS** ensure the commit succeeds before making further changes

**Commit Message Requirements:**
- **ALWAYS** write clear, descriptive commit messages
- **ALWAYS** include the file path and purpose of the change
- **ALWAYS** follow conventional commit format when possible
- **NEVER** use generic messages like "update" or "change"

**Commit Content Requirements:**
- **ALWAYS** commit only the specific changes made in that operation
- **NEVER** include unrelated modifications in the same commit
- **ALWAYS** ensure the commit represents a single, atomic change
- **NEVER** commit broken or incomplete functionality

**Commit Validation:**
- **ALWAYS** verify the commit was successful before proceeding
- **ALWAYS** ensure the working directory is clean after commit
- **ALWAYS** confirm the commit is properly tracked by git
- **NEVER** proceed if the commit fails or encounters errors

**Examples of Proper Commit Messages:**
- `feat: add data-id selectors for login page elements`
- `fix: correct typo in safety rules documentation`
- `docs: update Playwright best practices guide`
- `refactor: implement getter-setter pattern for page objects`

**Examples of Improper Commit Messages:**
- `update` (too generic)
- `changes` (too vague)
- `fix stuff` (unprofessional)
- `test` (doesn't describe what was tested)

**Exception Handling:**
- If a commit fails, **STOP** all automated actions immediately
- **NEVER** attempt to force push or override git history
- **ALWAYS** resolve commit issues manually with human intervention
- **WAIT** for explicit human approval before retrying failed commits

## Compliance Monitoring

### Regular Audits
- All modifications will be logged and reviewed
- Suspicious activities will trigger automatic alerts
- Non-compliance will result in immediate suspension of automated privileges

### Rule Updates
These rules may be updated periodically. Always check for the latest version before making modifications.

---

**IMPORTANT**: These rules are designed to protect the project from unintended consequences of automated actions. Violation of these rules may result in project corruption, data loss, or security vulnerabilities.

**By proceeding with any modifications, you acknowledge and agree to comply with these safety rules.**

**Last Updated**: February 2026
**Version**: 1.0
