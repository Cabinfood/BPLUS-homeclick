// backend/src/api/admin/content-blocks/reorder/route.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import ContentBlocksService from '../../../../modules/content-block/service';
import { CONTENT_BLOCK_MODULE } from 'modules/content-block';

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const contentBlocksService: ContentBlocksService = req.scope.resolve(CONTENT_BLOCK_MODULE);
  
  const body = req.body as any;
  
  if (!body.blocks || !Array.isArray(body.blocks)) {
    throw new Error('blocks array is required');
  }
  
  // Update each block with new rank
  for (const block of body.blocks) {
    if (block.id && typeof block.rank === 'number') {
      await (contentBlocksService as any).updateContentBlocks([{ id: block.id, rank: block.rank }]);
    }
  }
  
  res.json({ success: true });
}