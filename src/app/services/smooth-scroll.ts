import { DestroyRef, Inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Injectable()
export class SmoothScroll {
	private readonly _ease = 0.05 / 3;
	private _currentScroll = 0;
	private _targetScroll = 0;
	private _isAnimating = false;
	private _lastRoundedScroll = -1;

	constructor(@Inject(DestroyRef) private _destroyRef: DestroyRef) {
		this._initListeners();
	}

	private _initListeners(): void {
		fromEvent(window, 'scroll')
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._onScroll());

		fromEvent(window, 'resize')
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._updateTargetScroll());

		// начальная установка позиции
		this._updateTargetScroll();
	}

	private _onScroll(): void {
		this._updateTargetScroll();
		if (!this._isAnimating) {
			this._isAnimating = true;
			this._animateScroll();
		}
	}

	private _updateTargetScroll(): void {
		const scrollTop = window.scrollY;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		this._targetScroll = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

		if (Math.abs(scrollTop - scrollHeight) < 1) {
			this._targetScroll = 1;
		}
	}

	private _animateScroll(): void {
		this._currentScroll += (this._targetScroll - this._currentScroll) * this._ease;

		const rounded = parseFloat(this._currentScroll.toFixed(3));
		if (rounded !== this._lastRoundedScroll) {
			document.body.style.setProperty('--y', String(rounded));
			this._lastRoundedScroll = rounded;
		}

		if (Math.abs(this._currentScroll - this._targetScroll) > 0.001) {
			requestAnimationFrame(() => this._animateScroll());
		} else {
			this._currentScroll = this._targetScroll;
			const finalRounded = parseFloat(this._currentScroll.toFixed(3));
			if (finalRounded !== this._lastRoundedScroll) {
				document.body.style.setProperty('--y', String(finalRounded));
				this._lastRoundedScroll = finalRounded;
			}
			this._isAnimating = false;
		}
	}
}
