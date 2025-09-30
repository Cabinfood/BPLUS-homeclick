import { ModuleProviderExports } from '@medusajs/framework/types'
import MinioFileProviderService from './service'

const services = [MinioFileProviderService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport

// module key
export const MINIO_FILE_MODULE = 'minio-file'