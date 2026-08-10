import { ISS_BADGE_TAG, IssBadge } from './components/iss-badge/iss-badge';
import { ISS_BUTTON_TAG, IssButton } from './components/iss-button/iss-button';
import { ISS_INPUT_TAG, IssInput } from './components/iss-input/iss-input';

export function defineIssButton(tagName = ISS_BUTTON_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssButton);
  }
}

export function defineIssInput(tagName = ISS_INPUT_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssInput);
  }
}

export function defineIssBadge(tagName = ISS_BADGE_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssBadge);
  }
}

export function registerIssComponents(): void {
  defineIssButton();
  defineIssInput();
  defineIssBadge();
}
