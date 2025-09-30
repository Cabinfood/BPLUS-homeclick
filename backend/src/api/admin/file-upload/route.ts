// framework
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
// module key
import { MINIO_FILE_MODULE } from "modules/minio-file"
// services/models (local)
import MinioFileProviderService from "../../../modules/minio-file/service"

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const svc: MinioFileProviderService = req.scope.resolve(MINIO_FILE_MODULE)

  // Xử lý FormData
  const formData = await (req as any).formData()
  const file = formData.get('file') as File

  if (!file) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No file provided")
  }

  const filename = file.name
  const mimeType = file.type || "application/octet-stream"
  
  let buffer: Buffer
  try {
    const arrayBuffer = await file.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  } catch {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Failed to read file")
  }

  try {
    const result = await svc.upload({
      filename,
      mimeType,
      content: buffer,
    } as any)

    res.json({ url: (result as any)?.url, key: (result as any)?.key })
  } catch (e) {
    const message = (e as Error)?.message || "Failed to upload file"
    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
  }
}


