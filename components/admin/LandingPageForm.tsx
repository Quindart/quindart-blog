"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type FormData = {
  slug: string
  html: string
  images: string[]
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalUrl?: string
  id?: number
}

interface LandingPageFormProps {
  initialData?: {
    id: number
    slug: string
    html: string
    images: string[]
    metaTitle: string
    metaDescription: string
    keywords: string[]
    canonicalUrl?: string
    lighthouseScore?: number
  }
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function LandingPageForm({
  initialData,
  onSubmit,
  isLoading = false
}: LandingPageFormProps) {
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [html, setHtml] = useState(initialData?.html || '')
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [imageInput, setImageInput] = useState('')
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '')
  const [keywords, setKeywords] = useState(initialData?.keywords?.join(', ') || '')
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || '')
  const [error, setError] = useState('')
  const [lighthouseScore, setLighthouseScore] = useState(initialData?.lighthouseScore)

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()])
      setImageInput('')
    }
  }

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const parsedKeywords = keywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0)

      const data: FormData = {
        slug: slug.trim(),
        html: html.trim(),
        images,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        keywords: parsedKeywords,
        canonicalUrl: canonicalUrl.trim() || undefined
      }

      if (initialData?.id) {
        data.id = initialData.id
      }

      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving')
    }
  }

  const getLighthouseColor = () => {
    if (lighthouseScore === null || lighthouseScore === undefined) {
      return 'bg-gray-100 text-gray-700'
    }
    if (lighthouseScore >= 90) {
      return 'bg-green-100 text-green-700'
    }
    return 'bg-red-100 text-red-700'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <Input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          disabled={!!initialData}
          placeholder="my-landing-page"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Subdomain: {slug || 'your-slug'}.quindart.com</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">HTML Content</label>
        <Textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={12}
          placeholder="<h1>Your HTML content here</h1>"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images (Cloudinary URLs)</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddImage()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddImage}
              variant="outline"
            >
              Add
            </Button>
          </div>
          {images.length > 0 && (
            <div className="border rounded p-3 space-y-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <code className="text-xs text-gray-600 truncate">{img}</code>
                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    variant="ghost"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Meta Title</label>
          <Input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="SEO Page Title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Canonical URL (optional)</label>
          <Input
            type="text"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            placeholder="https://example.com/page"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Meta Description</label>
        <Textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          placeholder="Page description for search engines"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
        <Input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="seo, keywords, landing page"
        />
      </div>

      {initialData && lighthouseScore !== null && lighthouseScore !== undefined && (
        <div className="flex items-center gap-4">
          <div className={cn("px-4 py-2 rounded font-semibold", getLighthouseColor())}>
            Lighthouse Score: {lighthouseScore}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // This opens a modal in the parent component
              // For now, this is just a placeholder
            }}
          >
            Check Lighthouse
          </Button>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
