"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface LighthouseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  landingPageId: number
  onScoreUpdate: (score: number, report: any) => void
}

export default function LighthouseModal({
  open,
  onOpenChange,
  landingPageId,
  onScoreUpdate
}: LighthouseModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [report, setReport] = useState<any>(null)

  const handleCheckLighthouse = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/landing-pages/check-lighthouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: landingPageId })
      })

      if (response.ok) {
        const data = await response.json()
        const lighthouseScore = data.lighthouseScore
        const lighthouseReport = data.lighthouseReport

        setScore(lighthouseScore)
        setReport(lighthouseReport)
        onScoreUpdate(lighthouseScore, lighthouseReport)
      } else {
        setError('Failed to run Lighthouse audit. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while running the audit. Please try again.')
      console.error('Lighthouse audit error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '✓ Ready to publish!'
    if (score >= 70) return '⚠ Needs improvement'
    return '✗ Needs significant work'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lighthouse Performance Audit</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {score !== null ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                  {score}
                </div>
                <p className="text-lg font-semibold">
                  {getScoreMessage(score)}
                </p>
              </div>

              {score < 90 && (
                <p className="text-sm text-gray-600">
                  Score must be 90 or higher to publish. Run the audit again after making improvements.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Click below to run a Lighthouse performance audit. This may take 10-20 seconds.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!score && (
            <Button onClick={handleCheckLighthouse} disabled={isLoading}>
              {isLoading ? 'Running audit...' : 'Run Lighthouse Audit'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
