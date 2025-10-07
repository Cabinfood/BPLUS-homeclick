import R2FileProviderService from "./service"
import { Module } from "@medusajs/framework/utils"

export const R2_FILE_MODULE = "r2-file"

export default Module(R2_FILE_MODULE, {
  service: R2FileProviderService,
})
