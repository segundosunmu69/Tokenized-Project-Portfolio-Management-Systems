# Blockchain-Based Quality Supplier Assessment Networks

A comprehensive blockchain solution for managing supplier quality assessments, certifications, and performance evaluations using Clarity smart contracts on the Stacks blockchain.

## Overview

This system provides a decentralized platform for:
- Verifying and managing quality assessors
- Coordinating supplier assessments
- Evaluating supplier performance
- Planning improvements
- Managing certifications and compliance

## Smart Contracts

### 1. Supplier Assessor Verification (`supplier-assessor-verification.clar`)
Manages the registration, verification, and performance tracking of quality assessors.

**Key Features:**
- Assessor registration and verification
- Performance statistics tracking
- Status management (pending, verified, suspended, revoked)
- Rating calculation based on assessment success rate

**Main Functions:**
- `register-assessor`: Register a new assessor
- `verify-assessor`: Verify an assessor (owner only)
- `update-assessor-stats`: Update assessor performance statistics
- `get-assessor`: Retrieve assessor information
- `is-verified-assessor`: Check if assessor is verified

### 2. Assessment Coordination (`assessment-coordination.clar`)
Coordinates the assessment process from scheduling to completion.

**Key Features:**
- Assessment scheduling
- Status tracking (scheduled, in-progress, completed, cancelled)
- Score and notes recording
- Assessor authorization validation

**Main Functions:**
- `schedule-assessment`: Schedule a new assessment
- `start-assessment`: Begin an assessment
- `complete-assessment`: Complete an assessment with score and notes
- `get-assessment`: Retrieve assessment details

### 3. Performance Evaluation (`performance-evaluation.clar`)
Evaluates and tracks supplier performance based on assessment results.

**Key Features:**
- Performance metrics calculation
- Risk level assessment
- Historical performance tracking
- Average score computation

**Main Functions:**
- `record-performance`: Record assessment performance
- `get-supplier-performance`: Get supplier performance metrics
- `get-performance-history`: Get historical performance data

**Risk Levels:**
- Level 1: Low risk (score ≥ 80)
- Level 2: Medium risk (score ≥ 60, < 80)
- Level 3: High risk (score < 60)

### 4. Improvement Planning (`improvement-planning.clar`)
Manages supplier improvement plans and action items.

**Key Features:**
- Improvement plan creation and management
- Action item tracking
- Status management (draft, active, completed, cancelled)
- Responsibility assignment

**Main Functions:**
- `create-improvement-plan`: Create a new improvement plan
- `add-plan-action`: Add action items to a plan
- `complete-action`: Mark action as completed
- `activate-plan`: Activate a draft plan
- `get-improvement-plan`: Retrieve plan details

### 5. Certification Management (`certification-management.clar`)
Manages supplier certifications and compliance tracking.

**Key Features:**
- Certification issuance and renewal
- Multiple certification levels
- Expiry tracking
- Certification validation

**Certification Levels:**
- Level 1: Basic
- Level 2: Intermediate
- Level 3: Advanced
- Level 4: Premium

**Main Functions:**
- `issue-certification`: Issue a new certification
- `renew-certification`: Renew existing certification
- `revoke-certification`: Revoke a certification
- `is-certification-valid`: Check certification validity
- `get-certification-level`: Get supplier's certification level

## Installation and Setup

### Prerequisites
- Stacks blockchain node or access to testnet/mainnet
- Clarity CLI tools
- Node.js and npm (for testing)

### Deployment
1. Clone the repository
2. Deploy contracts to Stacks blockchain:
   \`\`\`bash
   clarinet deploy --testnet
   \`\`\`

### Testing
Run the test suite using Vitest:
\`\`\`bash
npm install
npm test
\`\`\`

## Usage Examples

### Register and Verify an Assessor
\`\`\`clarity
;; Register assessor
(contract-call? .supplier-assessor-verification register-assessor "John Quality Expert" u3)

;; Verify assessor (owner only)
(contract-call? .supplier-assessor-verification verify-assessor 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
\`\`\`

### Schedule and Complete Assessment
\`\`\`clarity
;; Schedule assessment
(contract-call? .assessment-coordination schedule-assessment
'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG  ;; supplier
'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0  ;; assessor
"Quality Audit"
u2000)  ;; scheduled date

;; Start assessment
(contract-call? .assessment-coordination start-assessment u1)

;; Complete assessment
(contract-call? .assessment-coordination complete-assessment u1 u85 "Good performance with minor improvements needed")
\`\`\`

### Issue Certification
\`\`\`clarity
;; Issue ISO-9001 certification
(contract-call? .certification-management issue-certification
'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG  ;; supplier
"ISO-9001"
u2  ;; intermediate level
u1000  ;; validity period
u80)  ;; score requirement
\`\`\`

## Error Codes

### Supplier Assessor Verification
- `u100`: Unauthorized
- `u101`: Assessor not found
- `u102`: Assessor already exists
- `u103`: Invalid status

### Assessment Coordination
- `u200`: Unauthorized
- `u201`: Assessment not found
- `u202`: Invalid status
- `u203`: Assessor not verified

### Performance Evaluation
- `u300`: Unauthorized
- `u301`: Supplier not found
- `u302`: Invalid score

### Improvement Planning
- `u400`: Unauthorized
- `u401`: Plan not found
- `u402`: Invalid status

### Certification Management
- `u500`: Unauthorized
- `u501`: Certification not found
- `u502`: Certification expired
- `u503`: Invalid level

## Security Considerations

1. **Access Control**: Only contract owners can verify assessors and issue certifications
2. **Data Integrity**: All data is stored immutably on the blockchain
3. **Authorization**: Assessors can only manage their own assessments
4. **Validation**: Input validation prevents invalid data entry

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the GitHub repository.
\`\`\`

Now let me create the PR details file:
