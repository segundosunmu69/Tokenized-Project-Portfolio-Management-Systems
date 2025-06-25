;; Performance Tracking Contract
;; Tracks portfolio and project performance metrics

(define-constant ERR_UNAUTHORIZED (err u400))
(define-constant ERR_INVALID_METRICS (err u401))
(define-constant ERR_PROJECT_NOT_FOUND (err u402))

;; Data structures
(define-map project-performance uint {
    completion-percentage: uint,
    budget-utilization: uint,
    timeline-adherence: uint,
    quality-score: uint,
    last-updated: uint
})

(define-map portfolio-performance principal {
    total-projects: uint,
    completed-projects: uint,
    average-performance: uint,
    total-value-delivered: uint,
    performance-trend: uint,
    last-calculated: uint
})

(define-map performance-history uint (list 10 {
    timestamp: uint,
    completion: uint,
    budget-util: uint,
    timeline: uint,
    quality: uint
}))

;; Read-only functions
(define-read-only (get-project-performance (project-id uint))
    (map-get? project-performance project-id)
)

(define-read-only (get-portfolio-performance (manager principal))
    (map-get? portfolio-performance manager)
)

(define-read-only (calculate-overall-score (completion uint) (budget-util uint) (timeline uint) (quality uint))
    (/ (+ completion budget-util timeline quality) u4)
)

(define-read-only (get-performance-history (project-id uint))
    (default-to (list) (map-get? performance-history project-id))
)

;; Public functions
(define-public (update-project-performance (project-id uint) (completion uint) (budget-util uint) (timeline uint) (quality uint))
    (begin
        (asserts! (<= completion u100) ERR_INVALID_METRICS)
        (asserts! (<= budget-util u100) ERR_INVALID_METRICS)
        (asserts! (<= timeline u100) ERR_INVALID_METRICS)
        (asserts! (<= quality u100) ERR_INVALID_METRICS)

        (let ((overall-score (calculate-overall-score completion budget-util timeline quality))
              (current-history (get-performance-history project-id))
              (new-entry {
                  timestamp: block-height,
                  completion: completion,
                  budget-util: budget-util,
                  timeline: timeline,
                  quality: quality
              }))
            (map-set project-performance project-id {
                completion-percentage: completion,
                budget-utilization: budget-util,
                timeline-adherence: timeline,
                quality-score: quality,
                last-updated: block-height
            })
            (map-set performance-history project-id
                (unwrap-panic (as-max-len? (append current-history new-entry) u10)))
            (ok overall-score)
        )
    )
)

(define-public (calculate-portfolio-performance (total-projects uint) (completed-projects uint))
    (let ((completion-rate (if (> total-projects u0) (/ (* completed-projects u100) total-projects) u0))
          (trend-score u75)) ;; Simplified trend calculation
        (map-set portfolio-performance tx-sender {
            total-projects: total-projects,
            completed-projects: completed-projects,
            average-performance: completion-rate,
            total-value-delivered: (* completed-projects u1000), ;; Simplified value calculation
            performance-trend: trend-score,
            last-calculated: block-height
        })
        (ok completion-rate)
    )
)
