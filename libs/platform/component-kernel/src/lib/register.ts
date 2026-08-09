import { ISS_BUTTON_TAG, IssButton } from './components/iss-button/iss-button';

export function defineIssButton(tagName = ISS_BUTTON_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssButton);
  }
}

export function registerIssComponents(): void {
  defineIssButton();
}
