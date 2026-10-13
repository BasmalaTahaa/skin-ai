'use client'

import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { useState, useRef } from 'react'

interface UploadCardProps {
  onImageSelect: (file: File) => void
}

export default function UploadCard({ onImageSelect }: UploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-rose/20 shadow-lg">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
          ${dragActive 
            ? 'border-pink-accent bg-soft-pink/50 scale-105' 
            : 'border-rose/30 hover:border-pink-accent/50 hover:bg-soft-pink/20'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 mx-auto rounded-xl shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-soft-pink transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-accent/20 to-lavender-accent/20 rounded-2xl flex items-center justify-center">
                <Upload className="w-10 h-10 text-pink-accent" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Drag & drop your image here
            </h3>
            <p className="text-gray-500 mb-6">or click to browse</p>
            <label
              htmlFor="image-upload"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-accent to-lavender-accent text-white rounded-xl font-semibold cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Choose Image
            </label>
          </>
        )}
      </div>
    </div>
  )
}

