import { defineWidgetConfig } from "@medusajs/admin-sdk"; // admin widget config
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"; // medusa types
import {
  Container,
  Heading,
  Button,
  Text,
  IconButton,
  Input,
  FocusModal,
} from "@medusajs/ui"; // ui components
import { useEffect } from "react"; // react hooks
import { Trash } from "@medusajs/icons"; // icons
import { useCallback, useMemo, useRef, useState } from "react"; // react hooks
import { UploadPanel } from "./components/UploadPanel.js"; // local components
import { AdminModelViewer } from "./components/AdminModelViewer.js"; // local components

const MODEL_URL_KEY = "model_url"; // metadata key for 3D model URL

const ACCEPT_MIME = "model/gltf-binary"; // .glb mime
const ACCEPT_EXT = ".glb";

const ProductModelUploadWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const initialUrl = useMemo(() => {
    const md = (product?.metadata || {}) as Record<string, unknown>;
    const url =
      typeof md[MODEL_URL_KEY] === "string"
        ? (md[MODEL_URL_KEY] as string)
        : "";
    return url;
  }, [product?.metadata]);

  const [modelUrl, setModelUrl] = useState<string>(initialUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "saving" | "saved" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSavedModel = !!modelUrl && !selectedFile;
  const hasSelectedFile = !!selectedFile;
  const isProcessing = status === "uploading" || status === "saving";

  // preview URL for selected file (blob) vs saved model URL
  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return modelUrl || "";
  }, [selectedFile, modelUrl]);

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = previewUrl;
    return () => {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {}
    };
  }, [selectedFile, previewUrl]);

  const handleChooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const isGlb =
        file.name.toLowerCase().endsWith(".glb") || file.type === ACCEPT_MIME;
      if (!isGlb) {
        // simple guard: reject non-glb
        event.target.value = "";
        return;
      }
      setSelectedFile(file);
    },
    []
  );

  const handleUploadAndSave = useCallback(async () => {
    if (!selectedFile) return;
    try {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("files", selectedFile);

      const uploadResponse = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      const uploadedFileUrl: string | undefined = uploadResult.files?.[0]?.url;
      if (!uploadedFileUrl) {
        throw new Error("No file URL returned from upload");
      }

      setStatus("saving");

      const nextMetadata = {
        ...(product.metadata || {}),
        [MODEL_URL_KEY]: uploadedFileUrl,
      };

      const updateResponse = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ metadata: nextMetadata }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Update failed: ${updateResponse.status}`);
      }

      setModelUrl(uploadedFileUrl);
      setSelectedFile(null);
      setStatus("saved");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => setStatus("idle"), 1500);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error uploading and saving model:", e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }, [product.id, product.metadata, selectedFile]);

  const handleRemoveModel = useCallback(async () => {
    try {
      setStatus("saving");
      const nextMetadata: Record<string, unknown> = {
        ...(product.metadata || {}),
      };
      delete nextMetadata[MODEL_URL_KEY];

      const response = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ metadata: nextMetadata }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setModelUrl("");
      setSelectedFile(null);
      setStatus("saved");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setStatus("idle"), 1500);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error removing model:", e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }, [product.id, product.metadata]);

  return (
    <Container className="p-0 divide-y">
      <div className="flex justify-between items-center px-6 py-4">
        <Heading level="h2">Model 3D (.glb)</Heading>
        <div className="flex gap-2 items-center">
          {(modelUrl || selectedFile) && (
            <FocusModal>
              <FocusModal.Trigger asChild>
                <Button variant="secondary">Config Model 3D</Button>
              </FocusModal.Trigger>
              <FocusModal.Content>
                <FocusModal.Header>
                  <FocusModal.Title>Config 3D Model</FocusModal.Title>
                </FocusModal.Header>
                <FocusModal.Body className="py-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="col-span-2 rounded-md border">
                      <div className="w-full min-h-full">
                        <AdminModelViewer src={previewUrl} />
                      </div>
                    </div>
                    <div className="flex flex-col col-span-1 gap-3">
                      <div>Comming soon</div>
                    </div>
                  </div>
                </FocusModal.Body>
                <FocusModal.Footer>
                  <FocusModal.Close asChild>
                    <Button variant="secondary">Close</Button>
                  </FocusModal.Close>
                </FocusModal.Footer>
              </FocusModal.Content>
            </FocusModal>
          )}
        </div>
      </div>

      <div className="grid gap-3 px-6 py-4">
        <UploadPanel
          fileInputRef={fileInputRef}
          hasSavedModel={hasSavedModel}
          hasSelectedFile={hasSelectedFile}
          isProcessing={isProcessing}
          modelUrl={modelUrl}
          selectedFile={selectedFile}
          handleChooseFile={handleChooseFile}
          handleFileSelect={handleFileSelect}
          handleUploadAndSave={handleUploadAndSave}
          handleRemoveModel={handleRemoveModel}
          status={status}
          handleFileDropped={(file) => {
            const isGlb =
              file.name.toLowerCase().endsWith(ACCEPT_EXT) ||
              file.type === ACCEPT_MIME;
            if (!isGlb) return;
            setSelectedFile(file);
          }}
          acceptExt={ACCEPT_EXT}
          acceptMime={ACCEPT_MIME}
          previewUrl={previewUrl}
        />
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductModelUploadWidget;
