import { AbstractFileProviderService, MedusaError } from '@medusajs/framework/utils'
import { Logger } from '@medusajs/framework/types'
import { 
  ProviderUploadFileDTO,
  ProviderDeleteFileDTO,
  ProviderFileResultDTO,
  ProviderGetFileDTO
} from '@medusajs/framework/types'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import path from 'path'
import { ulid } from 'ulid'

type InjectedDependencies = {
  logger: Logger
}

interface R2ServiceConfig {
  file_url: string
  access_key_id: string
  secret_access_key: string
  region: string
  bucket: string
  endpoint: string
}

export interface R2FileProviderOptions {
  file_url: string
  access_key_id: string
  secret_access_key: string
  region?: string
  bucket: string
  endpoint: string
}

/**
 * Extended ProviderUploadFileDTO with moduleType support
 */
interface ExtendedProviderUploadFileDTO extends ProviderUploadFileDTO {
  moduleType?: string
}

/**
 * Service to handle file storage using Cloudflare R2 (S3-compatible).
 * Supports directory structure based on module type.
 */
class R2FileProviderService extends AbstractFileProviderService {
  static identifier = 'r2-file'
  protected readonly config_: R2ServiceConfig
  protected readonly logger_: Logger
  protected client: S3Client

  constructor({ logger }: InjectedDependencies, options: R2FileProviderOptions) {
    super()
    this.logger_ = logger
    this.config_ = {
      file_url: options.file_url,
      access_key_id: options.access_key_id,
      secret_access_key: options.secret_access_key,
      region: options.region || 'auto',
      bucket: options.bucket,
      endpoint: options.endpoint
    }

    // Initialize R2 client
    this.client = new S3Client({
      region: this.config_.region,
      endpoint: this.config_.endpoint,
      credentials: {
        accessKeyId: this.config_.access_key_id,
        secretAccessKey: this.config_.secret_access_key,
      },
    })

    this.logger_.info(`R2 file service initialized with bucket: ${this.config_.bucket}`)
  }

  static validateOptions(options: Record<string, any>) {
    const requiredFields = [
      'file_url',
      'access_key_id',
      'secret_access_key',
      'bucket',
      'endpoint'
    ]

    requiredFields.forEach((field) => {
      if (!options[field]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${field} is required in the provider's options`
        )
      }
    })
  }

  /**
   * Generate file key with optional directory prefix based on module type
   */
  private generateFileKey(filename: string, moduleType?: string): string {
    const parsedFilename = path.parse(filename)
    const uniqueFilename = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`
    
    // If moduleType is provided, create directory structure
    if (moduleType) {
      return `${moduleType}/${uniqueFilename}`
    }
    
    return uniqueFilename
  }

  async upload(
    file: ExtendedProviderUploadFileDTO
  ): Promise<ProviderFileResultDTO> {
    if (!file) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file provided'
      )
    }

    if (!file.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No filename provided'
      )
    }

    try {
      const fileKey = this.generateFileKey(file.filename, file.moduleType)
      const content = Buffer.from(file.content, 'binary')

      // Upload file to R2
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.config_.bucket,
          Key: fileKey,
          Body: content,
          ContentType: file.mimeType,
          Metadata: {
            'original-filename': file.filename,
            ...(file.moduleType && { 'module-type': file.moduleType })
          },
        })
      )

      // Generate public URL
      const url = `${this.config_.file_url}/${fileKey}`

      this.logger_.info(
        `Successfully uploaded file ${fileKey} to R2 bucket ${this.config_.bucket}` +
        (file.moduleType ? ` (module: ${file.moduleType})` : '')
      )

      return {
        url,
        key: fileKey
      }
    } catch (error) {
      this.logger_.error(`Failed to upload file: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to upload file: ${error.message}`
      )
    }
  }

  async delete(
    fileData: ProviderDeleteFileDTO
  ): Promise<void> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided'
      )
    }

    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.config_.bucket,
          Key: fileData.fileKey,
        })
      )
      this.logger_.info(`Successfully deleted file ${fileData.fileKey} from R2 bucket ${this.config_.bucket}`)
    } catch (error) {
      // Log error but don't throw if file doesn't exist
      this.logger_.warn(`Failed to delete file ${fileData.fileKey}: ${error.message}`)
    }
  }

  async getPresignedDownloadUrl(
    fileData: ProviderGetFileDTO
  ): Promise<string> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided'
      )
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.config_.bucket,
        Key: fileData.fileKey,
      })

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 24 * 60 * 60, // URL expires in 24 hours
      })

      this.logger_.info(`Generated presigned URL for file ${fileData.fileKey}`)
      return url
    } catch (error) {
      this.logger_.error(`Failed to generate presigned URL: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to generate presigned URL: ${error.message}`
      )
    }
  }
}

export default R2FileProviderService
