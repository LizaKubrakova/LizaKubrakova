import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'page-main',
  imports: [],
  templateUrl: './page-main.html',
  styleUrl: './page-main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageMain implements AfterViewInit {
	@ViewChild('mainContainer') private _mainContainer!: ElementRef<HTMLDivElement>;
	@ViewChild('videoElement') private _videoEl!: ElementRef<HTMLVideoElement>;

	private _resizeObserver: ResizeObserver = this._createResizeObserver();

	ngAfterViewInit(): void {
		this._resizeInit();
		this._videoAutoplayInit();
	}

	private _resizeInit(): void {
		setTimeout(() => {
			this._updateContainerHeight(this._mainContainer.nativeElement.offsetHeight);
		}, 50);
		this._resizeObserver.observe(this._mainContainer.nativeElement);
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
