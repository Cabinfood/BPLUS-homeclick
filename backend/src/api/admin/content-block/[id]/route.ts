// backend/src/api/admin/content-blocks/[id]/route.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import ContentBlocksService from '../../../../modules/content-block/service';
import { CONTENT_BLOCK_MODULE } from 'modules/content-block';

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  const contentBlocksService: ContentBlocksService = req.scope.resolve(CONTENT_BLOCK_MODULE);
  
  const { id } = req.params;
  const block = contentBlocksService.listContentBlocks(id);
  
  res.json({ block });
}

export async function PUT(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const contentBlocksService: ContentBlocksService = req.scope.resolve(CONTENT_BLOCK_MODULE);
  
  const { id } = req.params;
  const body = req.body as any;
  
  const block = contentBlocksService.updateContentBlocks({
    id,
    ...body,
  });
  
  res.json({ block });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const contentBlocksService: ContentBlocksService = req.scope.resolve(CONTENT_BLOCK_MODULE);
  
  const { id } = req.params;
  await contentBlocksService.deleteContentBlocks(id);
  
  res.json({ success: true });
}