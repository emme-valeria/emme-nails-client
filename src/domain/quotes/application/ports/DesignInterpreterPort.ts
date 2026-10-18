import { SuggestedDesignAttributes } from '../../entities/Inspiration';

export interface InterpretationInput {
  textDescription?: string;
  imageUrls?: string[];
}

export interface DesignInterpreterPort {
  interpretDesignRequest(input: InterpretationInput): Promise<SuggestedDesignAttributes>;
}
