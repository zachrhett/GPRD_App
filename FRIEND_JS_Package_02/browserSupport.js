export function installBrowserSupportWarnings() {
  const missing = [];
  if (!('fetch' in window)) missing.push('fetch');
  if (!('history' in window)) missing.push('history');
  if (!('Promise' in window)) missing.push('Promise');

  if (missing.length) {
    console.warn('F.R.I.E.N.D. compatibility warning:', missing.join(', '));
  }
}
