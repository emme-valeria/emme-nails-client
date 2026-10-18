import { DesignInterpreterPort, InterpretationInput } from '../../application/ports/DesignInterpreterPort';
import { SuggestedDesignAttributes } from '../../entities/Inspiration';
import { NailPhotoDetailProcessor } from './nail-photo-detail-processor';

export class SemanticDesignInterpreterAdapter implements DesignInterpreterPort {
  public async interpretDesignRequest(input: InterpretationInput): Promise<SuggestedDesignAttributes> {
    const analysis = NailPhotoDetailProcessor.analyzeNailPhoto({
      imageUrl: input.imageUrls && input.imageUrls.length > 0 ? input.imageUrls[0] : undefined,
      textDescription: input.textDescription,
    });

    return {
      ...analysis.suggestedAttributes,
      detailedAnalysis: analysis,
    };
  }
}

