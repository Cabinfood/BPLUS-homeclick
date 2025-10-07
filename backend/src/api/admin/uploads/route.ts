// framework
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import path from "path"
import { ulid } from "ulid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

/**
 * Override default /admin/uploads endpoint to support directory structure
 */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  // Get files from request - Medusa uses req.files from multer
  const files = (req as any).files as any[]
  
  if (!files || files.length === 0) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No files provided")
  }

  // Get module type from query params, or detect from referer
  let moduleType = req.query?.moduleType as string | undefined
  
  // If no query param, try to detect from referer URL
  if (!moduleType) {
    const referer = req.headers.referer || req.headers.referrer as string
    if (referer) {
      // Extract the path after /app/
      const match = referer.match(/\/app\/([^\/\?]+)/)
      if (match && match[1] !== 'app') {
        moduleType = match[1] // e.g., 'cms', 'products', 'hero-slide', etc.
      }
    }
  }
  
  console.log('[FILE UPLOAD] Module type:', moduleType || 'root')
  console.log('[FILE UPLOAD] Files count:', files.length)

  try {
    // Initialize S3 client for R2
    const s3Client = new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const originalFilename = file.originalname || file.name
        const mimeType = file.mimetype || file.type || "application/octet-stream"
        
        // Get file buffer from multer
        const buffer = file.buffer

        // Generate filename with directory prefix based on moduleType
        const parsedFilename = path.parse(originalFilename)
        const uniqueFilename = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`
        const fileKey = moduleType ? `${moduleType}/${uniqueFilename}` : uniqueFilename

        console.log('[FILE UPLOAD] Module Type:', moduleType)
        console.log('[FILE UPLOAD] Generated file key:', fileKey)
        console.log('[FILE UPLOAD] Original filename:', originalFilename)

        // Upload directly to R2 with full control over the key
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: fileKey, // This will preserve the path structure
            Body: buffer,
            ContentType: mimeType,
            Metadata: {
              'original-filename': originalFilename,
              ...(moduleType && { 'module-type': moduleType })
            },
          })
        )

        // Generate public URL
        const fileUrl = `${process.env.S3_FILE_URL}/${fileKey}`

        console.log('[FILE UPLOAD] Upload successful:', fileUrl)

        // Return format compatible with Medusa admin dashboard
        // Match the exact format Medusa expects
        return {
          url: fileUrl,
          // Additional fields that might be needed
          id: fileKey,
          key: fileKey,
          name: originalFilename,
          size: buffer.length,
          mime_type: mimeType,
          // Add metadata field that Medusa might expect
          metadata: {
            module_type: moduleType
          }
        }
      })
    )

    // Return response in format expected by Medusa admin
    console.log('[FILE UPLOAD] Returning response:', JSON.stringify(uploadedFiles, null, 2))
    
    // Medusa dashboard expects response with both 'uploads' and 'files' keys
    // to support different components
    const response = {
      uploads: uploadedFiles,
      files: uploadedFiles, // Some components might look for 'files' instead
    }
    
    res.status(200).json(response)
  } catch (e) {
    console.error('[FILE UPLOAD] Error:', e)
    const message = (e as Error)?.message || "Failed to upload files"
    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
  }
}
