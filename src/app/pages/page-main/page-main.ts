import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ToggleElement } from '../../components/toggle-element/toggle-element';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'page-main',
	imports: [
		ToggleElement
	],
	templateUrl: './page-main.html',
	styleUrl: './page-main.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageMain implements AfterViewInit, OnDestroy {
	@ViewChild('mainContainer') private _mainContainer!: ElementRef<HTMLDivElement>;
	@ViewChild('videoElement') private _videoEl!: ElementRef<HTMLVideoElement>;

	private _resizeObserver: ResizeObserver = this._createResizeObserver();

	constructor(
		private readonly _destroyRef: DestroyRef
	) { }

	ngAfterViewInit(): void {
		this._resizeInit();
		this._videoAutoplayInit();
		this._scrollInit();
	}

	ngOnDestroy(): void {
		this._resizeObserver.disconnect();
	}

	private _resizeInit(): void {
		setTimeout(() => {
			this._updateContainerHeight(this._mainContainer.nativeElement.offsetHeight);
		}, 50);
		this._resizeObserver.observe(this._mainContainer.nativeElement);
	}

	private _scrollInit(): void {
		fromEvent(window, 'scroll')
			.pipe(
				takeUntilDestroyed(this._destroyRef)
			)
			.subscribe(this._scrollFn);
	}

	private _scrollFn = (): void => {
		const scrollTop = window.scrollY;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		let scrollFraction = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

		// если прокрутка реально внизу (с точностью до 1px), то выставляем строго 1
		const isBottom = Math.abs(scrollTop - scrollHeight) < 1;

		document.body.style.setProperty('--y', isBottom ? '1' : scrollFraction.toFixed(3));
	}

	private _videoAutoplayInit(): void {
		document.body.addEventListener('click', this._videoPlay);
	}

	private _videoPlay = (): void => {
		const video = this._videoEl.nativeElement;

		video.play().catch(err => console.warn('Autoplay failed:', err));
		document.body.removeEventListener('click', this._videoPlay);
	}

	private _createResizeObserver(): ResizeObserver {
		return new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentRect) {
					this._updateContainerHeight(entry.contentRect.height);
				}
			}
		});
	}


	private _updateContainerHeight(height: number): void {
		const element = this._mainContainer.nativeElement;
		element.style.setProperty('--main-container-height', `${height}px`);
	}
}
