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

	private _resizeObserver: ResizeObserver = this._createResizeObserver();

	ngAfterViewInit(): void {
		setTimeout(() => {
			this._updateContainerHeight(this._mainContainer.nativeElement.offsetHeight);
		}, 50);
		this._resizeObserver.observe(this._mainContainer.nativeElement);
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
