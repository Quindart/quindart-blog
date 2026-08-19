"use client"

import React, { useEffect, useState } from 'react'
import LandingPageForm from '@/components/admin/LandingPageForm'

export default function LandingPagesAdmin() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/landing-pages', { credentials: 'same-origin' })
      if (res.ok) {
        const json = await res.json()
        setPages(json)
      } else {
        console.error('Failed to load landing pages')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Landing Pages</h1>
        <div>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={() => setShowCreate((s) => !s)}
          >
            {showCreate ? 'Close' : 'Create Landing Page'}
          </button>
        </div>
      </div>

      {message && <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded">{message}</div>}

      {showCreate && (
        <div className="mb-6 border rounded p-4">
          <LandingPageForm
            isLoading={isCreating}
            onSubmit={async (data) => {
              setIsCreating(true)
              setMessage(null)
              try {
                const res = await fetch('/api/landing-pages/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                  credentials: 'same-origin'
                })
                if (res.ok) {
                  const json = await res.json()
                  setMessage('Created landing page id: ' + json.id)
                  setShowCreate(false)
                  load()
                } else {
                  const e = await res.json()
                  setMessage('Error: ' + (e?.error || 'Failed'))
                }
              } catch (err) {
                console.error(err)
                setMessage('Error creating landing page')
              } finally {
                setIsCreating(false)
              }
            }}
          />
        </div>
      )}

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {pages.length === 0 && <div className="text-sm text-gray-600">No landing pages yet.</div>}
            {pages.map((p) => (
              <div key={p.id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.metaTitle || p.slug}</div>
                  <div className="text-xs text-gray-500">{p.slug} • {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <a className="text-sm text-blue-600" href={`/api/landing-pages/${p.slug}`} target="_blank" rel="noreferrer">View</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
