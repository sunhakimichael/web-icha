// Site-wide settings. Change contact details here only.
export const SITE = {
  // Digits only, with country code, no "+".
  whatsappNumber: '6282146138885',
  // Public Web3Forms access key (https://web3forms.com). Empty = WhatsApp-only mode.
  web3formsKey: '',
  // Leave a value empty to hide that icon in the footer.
  instagramUrl: '',
  email: '',
  storagePrefix: 'nusabyicha-',
};

export const whatsappUrl = (text = '') =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
