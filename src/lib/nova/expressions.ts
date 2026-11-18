export type Expression = "relaxed" | "curious" | "excited" | "happy";

export interface ExpressionParams {
  /** Vertical scale of the eye arcs (1 = as modelled). */
  eyeScaleY: number;
  /** Roll of the eye arcs in radians. */
  eyeTilt: number;
  /** Multiplier on the cyan emissive intensity. */
  eyeGlow: number;
  /** Roll of the head in radians. */
  headTilt: number;
}

export const EXPRESSIONS: Record<Expression, ExpressionParams> = {
  relaxed: { eyeScaleY: 1, eyeTilt: 0, eyeGlow: 1, headTilt: 0 },
  curious: { eyeScaleY: 1.15, eyeTilt: 0.12, eyeGlow: 1.15, headTilt: 0.12 },
  excited: { eyeScaleY: 1.25, eyeTilt: 0, eyeGlow: 1.8, headTilt: 0 },
  happy: { eyeScaleY: 1.05, eyeTilt: 0, eyeGlow: 1.4, headTilt: 0.05 },
};
