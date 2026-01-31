import { scoreService } from "@/shared/services/score-service";
import { TEST_MODES } from "@/shared/constants/app";

export const saveDecisionScore = (reactionMs: number, accuracy: number) =>
    scoreService.saveScore(reactionMs, TEST_MODES.DECISION);
