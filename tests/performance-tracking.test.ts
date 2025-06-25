import { describe, it, expect, beforeEach } from "vitest"

describe("Performance Tracking Contract", () => {
  let contractState
  
  beforeEach(() => {
    contractState = {
      projectPerformance: new Map(),
      portfolioPerformance: new Map(),
      performanceHistory: new Map(),
    }
  })
  
  describe("update-project-performance", () => {
    it("should update project performance successfully", () => {
      const projectId = 1
      const completion = 75
      const budgetUtil = 80
      const timeline = 90
      const quality = 85
      
      const result = updateProjectPerformance(contractState, projectId, completion, budgetUtil, timeline, quality)
      
      expect(result.success).toBe(true)
      expect(result.overallScore).toBe(82.5) // (75 + 80 + 90 + 85) / 4
      
      const performance = contractState.projectPerformance.get(projectId)
      expect(performance.completionPercentage).toBe(completion)
      expect(performance.budgetUtilization).toBe(budgetUtil)
      expect(performance.timelineAdherence).toBe(timeline)
      expect(performance.qualityScore).toBe(quality)
    })
    
    it("should reject invalid completion percentage", () => {
      const result = updateProjectPerformance(contractState, 1, 150, 80, 90, 85)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_INVALID_METRICS")
    })
    
    it("should reject invalid budget utilization", () => {
      const result = updateProjectPerformance(contractState, 1, 75, 150, 90, 85)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_INVALID_METRICS")
    })
    
    it("should maintain performance history", () => {
      const projectId = 1
      updateProjectPerformance(contractState, projectId, 75, 80, 90, 85)
      updateProjectPerformance(contractState, projectId, 80, 85, 95, 90)
      
      const history = contractState.performanceHistory.get(projectId)
      expect(history).toHaveLength(2)
      expect(history[0].completion).toBe(75)
      expect(history[1].completion).toBe(80)
    })
  })
  
  describe("calculate-portfolio-performance", () => {
    it("should calculate portfolio performance correctly", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      const totalProjects = 10
      const completedProjects = 7
      
      const result = calculatePortfolioPerformance(contractState, manager, totalProjects, completedProjects)
      
      expect(result.success).toBe(true)
      expect(result.completionRate).toBe(70) // (7 / 10) * 100
      
      const portfolio = contractState.portfolioPerformance.get(manager)
      expect(portfolio.totalProjects).toBe(totalProjects)
      expect(portfolio.completedProjects).toBe(completedProjects)
      expect(portfolio.averagePerformance).toBe(70)
    })
    
    it("should handle zero total projects", () => {
      const manager = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
      const totalProjects = 0
      const completedProjects = 0
      
      const result = calculatePortfolioPerformance(contractState, manager, totalProjects, completedProjects)
      
      expect(result.success).toBe(true)
      expect(result.completionRate).toBe(0)
    })
  })
  
  describe("calculate-overall-score", () => {
    it("should calculate overall score correctly", () => {
      const completion = 80
      const budgetUtil = 75
      const timeline = 90
      const quality = 85
      
      const score = calculateOverallScore(completion, budgetUtil, timeline, quality)
      
      expect(score).toBe(82.5) // (80 + 75 + 90 + 85) / 4
    })
    
    it("should handle zero values", () => {
      const score = calculateOverallScore(0, 0, 0, 0)
      
      expect(score).toBe(0)
    })
  })
  
  describe("get-performance-history", () => {
    it("should return empty array for project with no history", () => {
      const history = getPerformanceHistory(contractState, 999)
      
      expect(history).toEqual([])
    })
    
    it("should return performance history for project", () => {
      const projectId = 1
      contractState.performanceHistory.set(projectId, [
        { timestamp: 12345, completion: 50, budgetUtil: 60, timeline: 70, quality: 65 },
        { timestamp: 12346, completion: 75, budgetUtil: 80, timeline: 85, quality: 80 },
      ])
      
      const history = getPerformanceHistory(contractState, projectId)
      
      expect(history).toHaveLength(2)
      expect(history[0].completion).toBe(50)
      expect(history[1].completion).toBe(75)
    })
  })
})

// Helper functions to simulate contract behavior
function updateProjectPerformance(state, projectId, completion, budgetUtil, timeline, quality) {
  if (completion > 100 || budgetUtil > 100 || timeline > 100 || quality > 100) {
    return { success: false, error: "ERR_INVALID_METRICS" }
  }
  
  const overallScore = calculateOverallScore(completion, budgetUtil, timeline, quality)
  
  state.projectPerformance.set(projectId, {
    completionPercentage: completion,
    budgetUtilization: budgetUtil,
    timelineAdherence: timeline,
    qualityScore: quality,
    lastUpdated: Date.now(),
  })
  
  const currentHistory = state.performanceHistory.get(projectId) || []
  const newEntry = {
    timestamp: Date.now(),
    completion: completion,
    budgetUtil: budgetUtil,
    timeline: timeline,
    quality: quality,
  }
  
  const updatedHistory = [...currentHistory, newEntry].slice(-10) // Keep last 10 entries
  state.performanceHistory.set(projectId, updatedHistory)
  
  return { success: true, overallScore: overallScore }
}

function calculatePortfolioPerformance(state, manager, totalProjects, completedProjects) {
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
  const trendScore = 75 // Simplified trend calculation
  
  state.portfolioPerformance.set(manager, {
    totalProjects: totalProjects,
    completedProjects: completedProjects,
    averagePerformance: completionRate,
    totalValueDelivered: completedProjects * 1000,
    performanceTrend: trendScore,
    lastCalculated: Date.now(),
  })
  
  return { success: true, completionRate: completionRate }
}

function calculateOverallScore(completion, budgetUtil, timeline, quality) {
  return (completion + budgetUtil + timeline + quality) / 4
}

function getPerformanceHistory(state, projectId) {
  return state.performanceHistory.get(projectId) || []
}
