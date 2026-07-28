// Pure HTML template functions. No events, no logic, no styles.
// Changing the widget look → this file + styles.css.

export function tileHTML(controlId: string, icon: string, label: string, badge: string, active: boolean): string {
  return `<button class="kw-tile${active ? ' is-on' : ''}" data-control="${controlId}" aria-label="${label}">
    <span class="kw-tile-icon">${icon}</span>
    <span class="kw-tile-lbl">${label}</span>
    <span class="kw-tile-badge${active ? ' is-on' : ''}">${badge}</span>
  </button>`;
}

export function sectionHTML(title: string, tilesHtml: string): string {
  return `<div class="kw-section">
    <div class="kw-section-hdr"><span class="kw-section-title">${title}</span></div>
    <div class="kw-section-grid">${tilesHtml}</div>
  </div>`;
}

export function profileTileHTML(profileId: string, icon: string, label: string, desc: string, active: boolean): string {
  return `<button class="kw-prof-tile${active ? ' is-on' : ''}" data-profile="${profileId}" aria-label="${label}">
    <span class="kw-prof-icon">${icon}</span>
    <span class="kw-prof-lbl">${label}</span>
    <span class="kw-prof-desc">${desc}</span>
  </button>`;
}

export function textSizeHTML(
  icon: string, label: string,
  decAria: string, incAria: string,
  display: string
): string {
  return `<div class="kw-tsize">
    <span class="kw-tsize-lbl">
      <span class="kw-tsize-icon">${icon}</span>
      <span>${label}</span>
    </span>
    <div class="kw-tsize-ctl">
      <button class="kw-tsize-btn" aria-label="${decAria}">\u2212</button>
      <span class="kw-tsize-disp">${display}</span>
      <button class="kw-tsize-btn" aria-label="${incAria}">+</button>
    </div>
  </div>`;
}
