import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { interpretInformation } from './interpretation.service';
import { resolveInterpretationProviderConfig } from './provider-runtime-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected subject = '';
  protected context = '';
  protected question = '';
  protected status: 'empty' | 'loading' | 'error' = 'empty';
  protected message = 'Add context to begin an interpretation.';
  protected result = 'Your interpretation will appear here.';

  protected onInput(field: 'subject' | 'context' | 'question', event: Event): void {
    const target = event.target as EventTarget & { value?: string };
    this[field] = target.value ?? '';
  }

  protected async interpret(): Promise<void> {
    this.status = 'loading';
    this.message = 'Interpreting the supplied context...';
    this.result = 'Waiting for the interpretation...';

    try {
      const response = await interpretInformation(
        { subject: this.subject, context: this.context, question: this.question },
        resolveInterpretationProviderConfig(),
      );
      this.status = response.success ? 'empty' : 'error';
      this.message = response.success
        ? `Interpretation completed via ${response.provider} (${response.model}).`
        : `Interpretation failed via ${response.provider} (${response.model}).`;
      this.result = response.payload?.interpretation ?? response.summary;
    } catch (error) {
      this.status = 'error';
      this.message = 'Interpretation could not be started.';
      this.result = error instanceof Error ? error.message : 'Unknown error';
    }
  }
}
