/**
 * Funkcja do przepisywania parametrów UTM i fbclid z URL landingu do linku Skool
 * Umożliwia Facebookowi śledzenie konwersji z konkretnego landingu
 *
 * WAŻNE: fbclid jest kluczowy dla Facebook Conversion Tracking!
 */

const SKOOL_URL = 'https://www.skool.com/masterzone/about';

export function appendUTM(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();

  // Pobierz wszystkie parametry z aktualnego URL
  const urlParams = new URLSearchParams(window.location.search);

  // DEBUG - pokaż co widzimy
  console.log('=== DEBUG appendUTM ===');
  console.log('window.location.search:', window.location.search);
  console.log('window.location.href:', window.location.href);

  // Lista parametrów które chcemy przekazać (UTM + Facebook Click ID)
  const paramsToKeep = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  const newParams = new URLSearchParams();

  paramsToKeep.forEach(param => {
    const value = urlParams.get(param);
    console.log(`Parametr ${param}:`, value);
    if (value) {
      newParams.set(param, value);
    }
  });

  console.log('Końcowe parametry:', newParams.toString());
  const finalUrl = SKOOL_URL + (newParams.toString() ? '?' + newParams.toString() : '');
  console.log('Przekierowuję na:', finalUrl);
  console.log('=== KONIEC DEBUG ===');

  // Przekieruj z parametrami jeśli istnieją
  if (newParams.toString()) {
    window.location.href = SKOOL_URL + '?' + newParams.toString();
  } else {
    window.location.href = SKOOL_URL;
  }
}
