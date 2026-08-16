import { ISS_BADGE_TAG, IssBadge } from './components/iss-badge/iss-badge';
import { ISS_BUTTON_TAG, IssButton } from './components/iss-button/iss-button';
import { ISS_CARD_TAG, IssCard } from './components/iss-card/iss-card';
import { ISS_CHECKBOX_TAG, IssCheckbox } from './components/iss-checkbox/iss-checkbox';
import { ISS_DRAWER_TAG, IssDrawer } from './components/iss-drawer/iss-drawer';
import { ISS_FILTER_BAR_TAG, IssFilterBar } from './components/iss-filter-bar/iss-filter-bar';
import { ISS_INPUT_TAG, IssInput } from './components/iss-input/iss-input';
import { ISS_RADIO_TAG, IssRadio } from './components/iss-radio/iss-radio';
import { ISS_SELECT_TAG, IssSelect } from './components/iss-select/iss-select';
import { ISS_STATE_TAG, IssState } from './components/iss-state/iss-state';
import { ISS_TABLE_TAG, IssTable } from './components/iss-table/iss-table';

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

export function defineIssFilterBar(tagName = ISS_FILTER_BAR_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssFilterBar);
  }
}

export function defineIssSelect(tagName = ISS_SELECT_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssSelect);
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

export function defineIssDrawer(tagName = ISS_DRAWER_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssDrawer);
  }
}

export function defineIssCheckbox(tagName = ISS_CHECKBOX_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssCheckbox);
  }
}

export function defineIssRadio(tagName = ISS_RADIO_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssRadio);
  }
}

export function defineIssState(tagName = ISS_STATE_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssState);
  }
}

export function defineIssTable(tagName = ISS_TABLE_TAG): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, IssTable);
  }
}

export function registerIssComponents(): void {
  defineIssButton();
  defineIssInput();
  defineIssFilterBar();
  defineIssSelect();
  defineIssBadge();
  defineIssCard();
  defineIssDrawer();
  defineIssCheckbox();
  defineIssRadio();
  defineIssState();
  defineIssTable();
}
