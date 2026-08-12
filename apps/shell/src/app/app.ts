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
  protected inputValue = 'OPS-001';
  protected stateActionCount = 0;
  protected lastStateAction = 'None';

  protected onPrimaryAction(): void {
    this.buttonClicks += 1;
  }

  protected onInputChange(event: Event): void {
    const target = event.target as (EventTarget & { value?: string }) | null;
    this.inputValue = target?.value ?? '';
  }

  protected onStateAction(status: 'empty' | 'error'): void {
    this.stateActionCount += 1;
    this.lastStateAction = status;
  }
}
