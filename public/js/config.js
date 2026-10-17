// Site-wide settings. Change contact details here only.
export const SITE = {
  // Digits only, with country code, no "+".
  whatsappNumber: '6282146138885',
  // Public Web3Forms access key (https://web3forms.com). Empty = WhatsApp-only mode.
  web3formsKey: '2cf03d02-5090-4e3c-8664-9df2391a4bb6',
  // Leave a value empty to hide that icon in the footer.
  instagramUrl: 'https://www.instagram.com/chaalicious/',
  email: 'risaafifa73@gmail.com',
  storagePrefix: 'nusabyicha-',
};

export const whatsappUrl = (text = '') =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
