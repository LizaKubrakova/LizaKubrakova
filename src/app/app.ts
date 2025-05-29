import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageMain } from './pages/page-main/page-main';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
	imports: [PageMain],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected title = 'LizaKubrakova';
}
