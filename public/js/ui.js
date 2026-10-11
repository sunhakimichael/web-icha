import { SITE, whatsappUrl } from './config.js';
import { resetBooking } from './booking.js';
import { getLanguage, setLanguage, t } from './i18n.js';
import { readPref, writePref } from './storage.js';
import { focusableIn } from './util.js';

const body = document.body;
const modal = document.querySelector('[data-modal]');
const dialog = modal.querySelector('[role="dialog"]');
const pageRegions = [...document.querySelectorAll('.site-shell')];
let lastTrigger = null;

function initTheme() {
  const icon = document.querySelector('[data-theme-icon]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = (dark) => {
    // The inline script in <head> sets the initial class to avoid a flash; this keeps it in sync.
    document.documentElement.classList.toggle('dark', dark);
    icon.textContent = dark ? '☀' : '☾';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#1c1d1a' : '#B5532F';
  };
  apply(readPref('theme') ? readPref('theme') === 'dark' : media.matches);
  document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
    const dark = !document.documentElement.classList.contains('dark');
    writePref('theme', dark ? 'dark' : 'light');
    apply(dark);
  });
  media.addEventListener('change', (event) => {
    if (!readPref('theme')) apply(event.matches);
  });
}

function initMenu() {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.dataset.i18nLabel = open ? 'menuClose' : 'menuOpen';
    toggle.setAttribute('aria-label', t(toggle.dataset.i18nLabel));
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

function selectServiceButton(service) {
  document.querySelectorAll('.booking-option').forEach((button) => {
    const active = button.dataset.option === service;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function openModal(service = 'guide') {
  lastTrigger = document.activeElement;
  selectServiceButton(service);
  resetBooking(service);
  modal.hidden = false;
  body.classList.add('modal-open');
  pageRegions.forEach((region) => (region.inert = true));
  requestAnimationFrame(() =>
    (dialog.querySelector('[data-dynamic-fields] input, [data-dynamic-fields] select') || dialog).focus(),
  );
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  body.classList.remove('modal-open');
  pageRegions.forEach((region) => (region.inert = false));
  lastTrigger?.focus?.();
}

function initModal() {
  document
    .querySelectorAll('[data-booking]')
    .forEach((button) => button.addEventListener('click', () => openModal(button.dataset.booking)));
  modal
    .querySelectorAll('[data-modal-close]')
    .forEach((button) => button.addEventListener('click', closeModal));
  modal.querySelectorAll('.booking-option').forEach((button) =>
    button.addEventListener('click', () => {
      selectServiceButton(button.dataset.option);
      resetBooking(button.dataset.option);
    }),
  );
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key !== 'Tab') return;
    const focusable = focusableIn(dialog);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initJournalFilters() {
  const tools = document.querySelector('.journal-tools');
  const cards = [...document.querySelectorAll('.story-card')];
  // Year filters are generated from the cards so new stories never need a manual button.
  const years = [...new Set(cards.map((card) => card.dataset.year))].sort().reverse();
  years.forEach((year) => {
    const button = document.createElement('button');
    button.className = 'filter-button';
    button.type = 'button';
    button.dataset.filter = year;
    button.textContent = year;
    tools.append(button);
  });
  const buttons = [...tools.querySelectorAll('[data-filter]')];
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      buttons.forEach((item) => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      const filter = button.dataset.filter;
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.location === filter || card.dataset.year === filter;
        card.classList.toggle('filter-hidden', !matches);
      });
    });
  });
}

function initContactLinks() {
  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => (link.href = whatsappUrl()));
  const socials = {
    instagram: SITE.instagramUrl,
    email: SITE.email && `mailto:${SITE.email}`,
    whatsapp: whatsappUrl(),
  };
  document.querySelectorAll('[data-social]').forEach((link) => {
    const href = socials[link.dataset.social];
    if (href) link.href = href;
    else link.remove();
  });
}

function showToast(message) {
  const box = document.querySelector('[data-toast-box]');
  box.textContent = message;
  box.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => box.classList.remove('show'), 3000);
}

export function initUi() {
  initTheme();
  initMenu();
  initModal();
  initJournalFilters();
  initContactLinks();
  document
    .querySelectorAll('[data-toast]')
    .forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));
  document
    .querySelector('[data-language-toggle]')
    .addEventListener('click', () => setLanguage(getLanguage() === 'id' ? 'en' : 'id'));
  document.querySelectorAll('[data-year-now]').forEach((el) => (el.textContent = new Date().getFullYear()));
  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
