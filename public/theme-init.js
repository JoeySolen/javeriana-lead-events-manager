// Runs before the page is painted; keep the key and palette aligned with useTheme/CSS.
;(function () {
  var preference = 'system'
  try {
    var saved = window.localStorage.getItem('javeriana.theme.v1')
    if (saved === 'light' || saved === 'dark') preference = saved
  } catch {
    // Use the system preference when storage is unavailable.
  }
  var dark =
    preference === 'dark' ||
    (preference === 'system' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', dark ? '#101923' : '#fafafa')
})()
