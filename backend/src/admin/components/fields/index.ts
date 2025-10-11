/**
 * Shared Field Components
 * 
 * Các component này được sử dụng chung cho nhiều routes/features
 * Import từ đây để dễ maintain và refactor
 */

export { default as MediaFile } from "./MediaFile";
export { default as TextFields } from "./TextFields";
export { default as SpecsFields } from "./SpecsFields";

// Export types
export type { MediaFileBlockData } from "./MediaFile";
export type { TextBlockData } from "./TextFields";
export type { SpecsBlockData, SpecItem } from "./SpecsFields";
