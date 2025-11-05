/**
 * Smooth scroll to contact form
 * Used by CTA buttons to scroll down to the form instead of direct Skool link
 */
export function scrollToContactForm(e?: React.MouseEvent<HTMLAnchorElement>) {
  if (e) {
    e.preventDefault();
  }

  const formElement = document.getElementById("contact-form");

  if (formElement) {
    formElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    console.error("Contact form not found");
  }
}
