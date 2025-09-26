import { Button, Copy, IconButton, Input, Text } from "@medusajs/ui"; // UI controls
import { AdminModelViewer } from "./AdminModelViewer.js"; // inline preview viewer
import { Trash } from "@medusajs/icons"; // icons

type UploadPanelProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  hasSavedModel: boolean;
  hasSelectedFile: boolean;
  isProcessing: boolean;
  modelUrl: string;
  selectedFile: File | null;
  handleChooseFile: () => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadAndSave: () => Promise<void>;
  handleRemoveModel: () => Promise<void>;
  status: "idle" | "uploading" | "saving" | "saved" | "error";
  acceptExt?: string;
  acceptMime?: string;
  handleFileDropped?: (file: File) => void;
  maxSizeMB?: number;
  previewUrl?: string;
};

export const UploadPanel = ({
  fileInputRef,
  hasSavedModel,
  hasSelectedFile,
  isProcessing,
  modelUrl,
  selectedFile,
  handleChooseFile,
  handleFileSelect,
  handleUploadAndSave,
  handleRemoveModel,
  status,
  acceptExt = ".glb",
  acceptMime = "model/gltf-binary",
  handleFileDropped,
  maxSizeMB = 50,
  previewUrl,
}: UploadPanelProps) => {
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const isAccepted =
      file.name.toLowerCase().endsWith(acceptExt) || file.type === acceptMime;
    if (!isAccepted) {
      return;
    }
    if (handleFileDropped) {
      handleFileDropped(file);
    } else {
      // fallback: trigger onChange via hidden input if provided
      if (fileInputRef.current) {
        // Cannot programmatically set FileList safely; rely on provided fileDropped handler when possible
      }
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="grid gap-3">
      {previewUrl ? (
        <div className="rounded-md border">
          <div className="h-[260px] w-full">
            <AdminModelViewer src={previewUrl} />
          </div>
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept={`${acceptExt},${acceptMime}`}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!hasSavedModel && !hasSelectedFile && (
        <div
          className="flex flex-col gap-3 justify-center items-center px-4 py-8 rounded-lg border border-gray-300 border-dashed"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <div className="flex justify-center items-center w-10 h-10 rounded-full border border-gray-300">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M12 19V6" />
              <path d="M5 12l7-7 7 7" />
              <path d="M19 19H5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-ui-fg-base">
              Drop your model here
            </p>
            <p className="text-xs text-ui-fg-subtle">
              {acceptExt.toUpperCase()} ({acceptMime}), max {maxSizeMB}MB
            </p>
          </div>
          <Button
            onClick={handleChooseFile}
            variant="secondary"
            disabled={isProcessing}
          >
            Select file
          </Button>
        </div>
      )}

      {hasSelectedFile && (
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleUploadAndSave}
            isLoading={isProcessing}
            className="w-full"
          >
            {status === "uploading"
              ? "Uploading..."
              : status === "saving"
              ? "Saving..."
              : "Save"}
          </Button>
        </div>
      )}
      <Text size="small">
        The URL will be stored in product metadata as "model_url".
      </Text>

      {(modelUrl || hasSelectedFile) && (
        <div className="inline-block relative mt-2">
          {modelUrl ? (
            <div className="flex gap-2 justify-end w-full">
              <IconButton size="small">
                <Copy content={modelUrl} />
              </IconButton>
              <IconButton
                onClick={handleRemoveModel}
                size="small"
                isLoading={status === "saving"}
              >
                <Trash color="red" />
              </IconButton>
            </div>
          ) : null}
        </div>
      )}

      {status === "saved" && (
        <Text size="small" className="text-green-600">
          Saved successfully.
        </Text>
      )}
      {status === "error" && (
        <Text size="small" className="text-red-600">
          Error uploading or saving. Please try again.
        </Text>
      )}
    </div>
  );
};
