import { initBooking } from './booking.js';
import { getLanguage, setLanguage } from './i18n.js';
import { initUi } from './ui.js';

initBooking();
initUi();
setLanguage(getLanguage());
