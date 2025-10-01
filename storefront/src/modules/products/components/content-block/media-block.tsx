"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { MediaBlockProps } from "./types"

const MediaBlock: React.FC<MediaBlockProps> = ({
  data,
  className = "",
  isBackground = false,
  blockTitle,
  blockDescription,
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (data.type === "image") {
    if (isBackground) {
      return (
        <div className={`relative max-h-96 ${className}`}>
          {!imageError ? (
            <Image
              src={data.url}
              alt={data.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-red-600 bg-red-100">
              Failed to load background image
            </div>
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )
    }

    return (
      <div className={`relative w-full h-full max-h-96 ${className}`}>
        {/* Block level title and description */}
        {(blockTitle || blockDescription) && (
          <div className="absolute top-0 left-0 z-20 p-4 lg:p-9">
            {blockTitle && (
              <h2 className="mb-2 text-lg font-bold text-white drop-shadow-lg lg:text-3xl">
                {blockTitle}
              </h2>
            )}
            {blockDescription && (
              <p className="text-sm leading-relaxed drop-shadow-lg lg:text-lg text-white/90">
                {blockDescription}
              </p>
            )}
          </div>
        )}

        {!imageError && imageLoaded ? (
          <Image
            src={data.url}
            alt={data.alt || ""}
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full text-red-600 bg-red-100">
            Failed to load image
          </div>
        )}
      </div>
    )
  }

  if (data.type === "video") {
    return (
      <div
        className={`overflow-hidden relative w-full h-full max-h-96 ${className}`}
      >
        {/* Block level title and description */}
        {(blockTitle || blockDescription) && (
          <div className="absolute top-0 left-0 z-20 p-4 lg:p-9">
            {blockTitle && (
              <h4 className="mb-2 text-lg font-bold text-white drop-shadow-lg lg:text-3xl">
                {blockTitle}
              </h4>
            )}
            {blockDescription && (
              <p className="text-sm leading-relaxed drop-shadow-lg lg:text-lg text-white/90">
                {blockDescription}
              </p>
            )}
          </div>
        )}

        {data.caption && (
          <p className="absolute top-2 right-2 z-10 px-2 py-1 text-lg text-white rounded bg-black/50">
            {data.caption}
          </p>
        )}
        <video
          src={data.url}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
          poster={data.alt}
        />
      </div>
    )
  }

  return null
}

export default MediaBlock
