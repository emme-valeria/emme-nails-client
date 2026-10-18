import { DesignInterpreterPort, InterpretationInput } from '../ports/DesignInterpreterPort';
import { SuggestedDesignAttributes } from '../../entities/Inspiration';

export class InterpretDesignRequestUseCase {
  constructor(private interpreter: DesignInterpreterPort) {}

  public async execute(input: InterpretationInput): Promise<SuggestedDesignAttributes> {
    return this.interpreter.interpretDesignRequest(input);
  }
}
