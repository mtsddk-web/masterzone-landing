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

  // Lista parametrów które chcemy przekazać (UTM + Facebook Click ID)
  const paramsToKeep = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  const newParams = new URLSearchParams();

  paramsToKeep.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      newParams.set(param, value);
    }
  });

  // Przekieruj z parametrami jeśli istnieją
  if (newParams.toString()) {
    window.location.href = SKOOL_URL + '?' + newParams.toString();
  } else {
    window.location.href = SKOOL_URL;
  }
}
