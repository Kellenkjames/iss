import { ISS_BADGE_TAG, IssBadge } from './components/iss-badge/iss-badge';
import { ISS_BUTTON_TAG, IssButton } from './components/iss-button/iss-button';
import { ISS_CARD_TAG, IssCard } from './components/iss-card/iss-card';
import { ISS_INPUT_TAG, IssInput } from './components/iss-input/iss-input';
import { ISS_STATE_TAG, IssState } from './components/iss-state/iss-state';

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

export function defineIssCard(tagName = ISS_CARD_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssCard);
  }
}

export function defineIssState(tagName = ISS_STATE_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssState);
  }
}

export function registerIssComponents(): void {
  defineIssButton();
  defineIssInput();
  defineIssBadge();
  defineIssCard();
  defineIssState();
}
