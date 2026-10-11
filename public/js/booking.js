import { SITE, whatsappUrl } from './config.js';
import { formSchemas } from './forms.js';
import { getLanguage, onLanguageChange, t, textFor } from './i18n.js';
import { escapeHtml } from './util.js';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WHATSAPP_TEXT_LIMIT = 1500;
const AUTOCOMPLETE = {
  fullName: 'name',
  name: 'name',
  email: 'email',
  whatsapp: 'tel',
  country: 'country-name',
};

const form = document.querySelector('[data-booking-form]');
const formCopy = document.querySelector('[data-dynamic-form-copy]');
const fieldsBox = document.querySelector('[data-dynamic-fields]');
const submitButton = form.querySelector('[type="submit"]');
const submitLabel = form.querySelector('[data-submit-label]');
const privacyNote = form.querySelector('[data-privacy-note]');
const result = document.querySelector('[data-result]');

const whatsappOnly = () => !SITE.web3formsKey;
let selectedService = 'guide';
let sending = false;

// Option arrays are [value, labelId, labelEn] or [labelId, labelEn] (the Indonesian label is the value).
const optionValue = (option) => option[0];

function fieldMarkup(field) {
  if (field.section) return `<div class="form-section-title">${escapeHtml(textFor(field.section))}</div>`;
  const name = escapeHtml(field.name);
  const required = field.required ? ' required' : '';
  const label = `${escapeHtml(textFor(field.label))}${field.required ? ' <b aria-hidden="true">*</b>' : ''}`;
  const hint = field.sensitive ? `<small class="field-hint">${escapeHtml(t('optionalHint'))}</small>` : '';
  if (field.type === 'checkbox')
    return `<label class="form-check-single"><input type="checkbox" name="${name}" value="✓"${required} /><span>${label}</span></label>`;
  if (field.type === 'checkboxes') {
    const boxes = field.options
      .map(
        (option) =>
          `<label><input type="checkbox" name="${name}" value="${escapeHtml(optionValue(option))}" /><span>${escapeHtml(textFor(option))}</span></label>`,
      )
      .join('');
    const group = field.required ? ' data-required-group aria-required="true"' : '';
    return `<fieldset class="form-fieldset"${group}><legend>${label}</legend><div class="check-grid">${boxes}</div><p class="group-error" data-group-error role="alert" hidden></p></fieldset>`;
  }
  const autocomplete = AUTOCOMPLETE[field.name] ? ` autocomplete="${AUTOCOMPLETE[field.name]}"` : '';
  let control;
  if (field.type === 'textarea') control = `<textarea name="${name}" rows="3"${required}></textarea>`;
  else if (field.type === 'select') {
    const options = field.options
      .map(
        (option) =>
          `<option value="${escapeHtml(optionValue(option))}">${escapeHtml(textFor(option))}</option>`,
      )
      .join('');
    control = `<select name="${name}"${required}><option value="">${escapeHtml(t('chooseAnswer'))}</option>${options}</select>`;
  } else {
    const extra = field.type === 'number' ? ' min="1" inputmode="numeric"' : '';
    control = `<input type="${escapeHtml(field.type)}" name="${name}"${autocomplete}${extra}${required} />`;
  }
  const conditional = field.conditional ? ` data-conditional="${escapeHtml(field.conditional)}" hidden` : '';
  return `<label class="form-field"${conditional}><span>${label}</span>${hint}${control}</label>`;
}

function updateConditionalFields() {
  const packageValue = form.querySelector('[name="package"]')?.value;
  const serviceValue = form.querySelector('[name="service"]')?.value;
  form.querySelectorAll('[data-conditional="multi"]').forEach((field) => {
    field.hidden = packageValue !== 'multi';
    field.querySelectorAll('input, select, textarea').forEach((control) => (control.disabled = field.hidden));
  });
  const note = document.querySelector('[data-consultation-note]');
  if (note) note.hidden = serviceValue !== 'consultation';
  const startDate = form.querySelector('[name="startDate"]');
  const endDate = form.querySelector('[name="endDate"]');
  if (endDate) endDate.min = startDate?.value || startDate?.min || '';
}

// Captures what the visitor has typed so a re-render (e.g. language switch) doesn't wipe it.
function snapshot() {
  const data = new FormData(form);
  return Object.fromEntries([...new Set(data.keys())].map((key) => [key, data.getAll(key)]));
}
function restore(values) {
  for (const [key, list] of Object.entries(values)) {
    form.querySelectorAll(`[name="${CSS.escape(key)}"]`).forEach((control) => {
      if (control.type === 'checkbox') control.checked = list.includes(control.value);
      else control.value = list[0] ?? '';
    });
  }
}

export function renderServiceForm(service = selectedService, { keepValues = false } = {}) {
  const previous = keepValues ? snapshot() : null;
  selectedService = service;
  const schema = formSchemas[service];
  const consultationNote =
    service === 'plan'
      ? `<small class="conditional-note" data-consultation-note hidden>${
          getLanguage() === 'id'
            ? 'Untuk konsultasi, tulis beberapa pilihan jadwal di Catatan tambahan. Link Google Meet saya kirim setelah jadwal disepakati.'
            : 'For a consultation, list a few times that suit you in Additional notes. I’ll send a Google Meet link once we agree on a time.'
        }</small>`
      : '';
  formCopy.innerHTML = `<strong>${escapeHtml(textFor(schema.title))}</strong><span>${escapeHtml(textFor(schema.intro))}</span>${consultationNote}`;
  fieldsBox.innerHTML = schema.fields.map(fieldMarkup).join('');
  const today = new Date().toISOString().slice(0, 10);
  form.querySelectorAll('input[type="date"]').forEach((input) => (input.min = today));
  if (previous) restore(previous);
  updateConditionalFields();
  updateSubmitCopy();
}

function updateSubmitCopy() {
  if (sending) return;
  submitLabel.textContent = whatsappOnly() ? t('formSubmitWa') : t('formSubmit');
  privacyNote.innerHTML = whatsappOnly() ? t('privacyNoteWaHtml') : t('privacyNoteHtml');
}

export function resetBooking(service) {
  form.reset();
  form.hidden = false;
  result.hidden = true;
  renderServiceForm(service);
}

// Readable "Label: value" pairs in the visitor's current language, in schema order.
function collectAnswers() {
  const data = new FormData(form);
  const answers = [];
  for (const field of formSchemas[selectedService].fields) {
    if (!field.name) continue;
    const values = data.getAll(field.name).filter((value) => value !== '');
    if (!values.length) continue;
    const shown = field.options
      ? values.map((value) => textFor(field.options.find((option) => optionValue(option) === value) || value))
      : values;
    answers.push([textFor(field.label), shown.join(', ')]);
  }
  return answers;
}

function whatsappSummary(answers) {
  const header = `${t('waGreeting')} "${textFor(formSchemas[selectedService].title)}".`;
  let text = [header, '', ...answers.map(([label, value]) => `• ${label}: ${value}`)].join('\n');
  if (text.length > WHATSAPP_TEXT_LIMIT) text = `${text.slice(0, WHATSAPP_TEXT_LIMIT - 1)}…`;
  return text;
}

function showResult(kind, answers) {
  const titles = { success: 'successTitle', whatsapp: 'waOpenedTitle', error: 'errorTitle' };
  result.dataset.kind = kind;
  result.querySelector('[data-result-symbol]').textContent = kind === 'error' ? '!' : '✦';
  result.querySelector('[data-result-title]').textContent = t(titles[kind]);
  result.querySelector('[data-result-copy]').textContent =
    kind === 'success'
      ? textFor(formSchemas[selectedService].confirmation)
      : t(kind === 'whatsapp' ? 'waOpenedCopy' : 'errorCopy');
  const waLink = result.querySelector('[data-result-wa]');
  waLink.href = whatsappUrl(whatsappSummary(answers));
  result.querySelector('[data-result-retry]').hidden = kind !== 'error';
  form.hidden = true;
  result.hidden = false;
  result.focus();
}

function validateGroups() {
  let firstInvalid = null;
  form.querySelectorAll('[data-required-group]').forEach((group) => {
    const error = group.querySelector('[data-group-error]');
    const ok = Boolean(group.querySelector('input:checked'));
    error.hidden = ok;
    error.textContent = ok ? '' : t('pickOne');
    group.toggleAttribute('aria-invalid', !ok);
    if (!ok && !firstInvalid) firstInvalid = group;
  });
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
    firstInvalid.querySelector('input')?.focus({ preventScroll: true });
  }
  return !firstInvalid;
}

async function handleSubmit(event) {
  event.preventDefault();
  if (sending || !form.reportValidity() || !validateGroups()) return;
  const answers = collectAnswers();

  if (whatsappOnly()) {
    window.open(whatsappUrl(whatsappSummary(answers)), '_blank', 'noopener');
    showResult('whatsapp', answers);
    return;
  }

  const data = new FormData(form);
  const name = data.get('fullName') || data.get('name') || '';
  const payload = {
    access_key: SITE.web3formsKey,
    subject: `[NusaByIcha] ${textFor(formSchemas[selectedService].title)} — ${name}`,
    from_name: 'NusaByIcha website',
    replyto: data.get('email') || undefined,
    botcheck: form.querySelector('[name="botcheck"]').checked,
    ...Object.fromEntries(answers),
  };

  sending = true;
  submitButton.disabled = true;
  submitLabel.textContent = t('formSending');
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.success) throw new Error(body.message || `HTTP ${response.status}`);
    showResult('success', answers);
    form.reset();
  } catch (error) {
    console.error('Form submission failed:', error);
    showResult('error', answers);
  } finally {
    sending = false;
    submitButton.disabled = false;
    updateSubmitCopy();
  }
}

export function initBooking() {
  form.addEventListener('change', (event) => {
    updateConditionalFields();
    const group = event.target.closest('[data-required-group]');
    if (group?.querySelector('input:checked')) {
      group.querySelector('[data-group-error]').hidden = true;
      group.removeAttribute('aria-invalid');
    }
  });
  form.addEventListener('submit', handleSubmit);
  result.querySelector('[data-result-retry]').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    submitButton.focus();
  });
  onLanguageChange(() => {
    if (!form.hidden) renderServiceForm(selectedService, { keepValues: true });
    else updateSubmitCopy();
  });
}
