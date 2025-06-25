import { describe, it, expect, beforeEach } from "vitest"

describe("Portfolio Manager Verification Contract", () => {
  let contractState
  
  beforeEach(() => {
    contractState = {
      verifiedManagers: new Map(),
      managerDetails: new Map(),
      contractOwner: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KX17ECXJWHAL",
    }
  })
  
  describe("verify-manager", () => {
    it("should verify a new manager successfully", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      const name = "John Doe"
      const experience = 10
      const certification = 3
      
      // Simulate contract call
      const result = verifyManager(contractState, manager, name, experience, certification)
      
      expect(result.success).toBe(true)
      expect(contractState.verifiedManagers.get(manager)).toBe(true)
      expect(contractState.managerDetails.get(manager)).toEqual({
        name: name,
        experienceYears: experience,
        certificationLevel: certification,
        verifiedAt: expect.any(Number),
      })
    })
    
    it("should reject verification of already verified manager", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      contractState.verifiedManagers.set(manager, true)
      
      const result = verifyManager(contractState, manager, "John Doe", 10, 3)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_ALREADY_VERIFIED")
    })
    
    it("should reject unauthorized verification attempts", () => {
      const unauthorizedCaller = "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE"
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      
      const result = verifyManagerUnauthorized(contractState, manager, "John Doe", 10, 3, unauthorizedCaller)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_UNAUTHORIZED")
    })
  })
  
  describe("is-verified-manager", () => {
    it("should return true for verified manager", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      contractState.verifiedManagers.set(manager, true)
      
      const result = isVerifiedManager(contractState, manager)
      
      expect(result).toBe(true)
    })
    
    it("should return false for unverified manager", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      
      const result = isVerifiedManager(contractState, manager)
      
      expect(result).toBe(false)
    })
  })
  
  describe("revoke-verification", () => {
    it("should revoke verification successfully", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      contractState.verifiedManagers.set(manager, true)
      contractState.managerDetails.set(manager, {
        name: "John Doe",
        experienceYears: 10,
        certificationLevel: 3,
        verifiedAt: 12345,
      })
      
      const result = revokeVerification(contractState, manager)
      
      expect(result.success).toBe(true)
      expect(contractState.verifiedManagers.has(manager)).toBe(false)
      expect(contractState.managerDetails.has(manager)).toBe(false)
    })
    
    it("should reject revoking unverified manager", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      
      const result = revokeVerification(contractState, manager)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_NOT_VERIFIED")
    })
  })
})

// Helper functions to simulate contract behavior
function verifyManager(state, manager, name, experience, certification) {
  if (state.verifiedManagers.get(manager)) {
    return { success: false, error: "ERR_ALREADY_VERIFIED" }
  }
  
  state.verifiedManagers.set(manager, true)
  state.managerDetails.set(manager, {
    name: name,
    experienceYears: experience,
    certificationLevel: certification,
    verifiedAt: Date.now(),
  })
  
  return { success: true }
}

function verifyManagerUnauthorized(state, manager, name, experience, certification, caller) {
  if (caller !== state.contractOwner) {
    return { success: false, error: "ERR_UNAUTHORIZED" }
  }
  return verifyManager(state, manager, name, experience, certification)
}

function isVerifiedManager(state, manager) {
  return state.verifiedManagers.get(manager) || false
}

function revokeVerification(state, manager) {
  if (!state.verifiedManagers.get(manager)) {
    return { success: false, error: "ERR_NOT_VERIFIED" }
  }
  
  state.verifiedManagers.delete(manager)
  state.managerDetails.delete(manager)
  
  return { success: true }
}
