// src/modules/content-block/index.ts
import ContentBlockModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CONTENT_BLOCK_MODULE = "contentBlock"
export default Module(CONTENT_BLOCK_MODULE, {
  service: ContentBlockModuleService,
})