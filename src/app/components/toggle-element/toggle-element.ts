import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'toggle-element',
  imports: [
		CommonModule
	],
  templateUrl: './toggle-element.html',
  styleUrl: './toggle-element.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleElement {
	@Input() btnShowedText = 'Показать';
	@Input() btnHiddenText = 'Скрыть';
	@Input() isVisible = false;

	toggle(): void {
		this.isVisible = !this.isVisible;
	}
}
