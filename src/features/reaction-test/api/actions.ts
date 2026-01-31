import { scoreService } from "@/shared/services/score-service";
import { TEST_MODES } from "@/shared/constants/app";

export const saveReactionScore = (reactionMs: number) =>
    scoreService.saveScore(reactionMs, TEST_MODES.REACTION);
