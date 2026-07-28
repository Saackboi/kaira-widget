import { PREFIX, el } from '../state';
import { register } from './base';
import { LANG } from '../lang';

register({
  id: 'readingGuide',
  label: LANG.controls.readingGuide,
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  section: 'reading',
  type: 'toggle',
  apply(on: boolean | string) {
    if (on) {
      if (!el.guide) {
        const guide = document.createElement('div');
        guide.id = `${PREFIX}-reading-guide`;
        guide.style.cssText = [
          'position:fixed;left:0;width:100%;height:28px;',
          'background:rgba(255,255,0,0.35);',
          'pointer-events:none;z-index:999998;',
          'display:none;',
        ].join('');
        document.body.appendChild(guide);
        el.guide = guide;
      }
      el.guide.style.display = 'block';
      if (!el.guideHandler) {
        el.guideHandler = (e: MouseEvent) => {
          if (el.guide) el.guide.style.top = `${e.clientY - 14}px`;
        };
        document.addEventListener('mousemove', el.guideHandler);
      }
    } else {
      if (el.guide) el.guide.style.display = 'none';
      if (el.guideHandler) {
        document.removeEventListener('mousemove', el.guideHandler);
        el.guideHandler = null;
      }
    }
  },
});
