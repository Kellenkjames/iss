import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected title = 'shell';
  protected buttonClicks = 0;

  protected onPrimaryAction(): void {
    this.buttonClicks += 1;
  }
}
