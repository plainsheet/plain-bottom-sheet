import { toFixedNumber } from "../math/unit";
import { isNumber } from "../types/is-number";

export class AnimationFrame {
  public animationId: number | null;
  public isInProgress: boolean;
  public startedAt: number | null;

  constructor() {
    this.animationId = null;
    this.isInProgress = false;
    this.startedAt = null;
  }

  /**
   *
   * @param renderFrame- Function to render screen using the animation progress percentage.
   * @param duration- Duration of the animation, in MS.
   */
  public start(
    renderFrame: RenderFrame,
    duration: number,
    shouldRunForever = false
  ): void {
    this.isInProgress = true;
    const animationFrame = this;

    function animate(timestamp: number): void {
      if (!animationFrame.startedAt) {
        animationFrame.startedAt = timestamp;
      }

      /** @description In MS */
      const timePassed = timestamp - animationFrame.startedAt;

      const shouldEndImmediately = duration === 0;
      const progressPercent = shouldEndImmediately
        ? 1
        : toFixedNumber(timePassed / duration, 2);
      const isAnimationOver = progressPercent >= 1 && !shouldRunForever;

      renderFrame(progressPercent);

      if (isAnimationOver) {
        animationFrame.stop();
      } else {
        animationFrame.animationId = requestAnimationFrame(animate);
      }
    }

    this.animationId = requestAnimationFrame(animate);
  }

  public stop(): void {
    this.isInProgress = false;
    this.startedAt = null;

    if (isNumber(this.animationId)) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

/**
 * @param progressPercent- Progress of the animation in percentage, from 0 ~ 1
 */
export type RenderFrame = (progressPercent: number) => void;
