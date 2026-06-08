import { readFileSync } from "fs";
import { join } from "path";

// Prawdziwy route Next.js (NIE plik w public/) — odporny na znikanie z routingu.
// HTML serwowany 1:1 z content.html, prerenderowany w buildzie (force-static).
export const dynamic = "force-static";

const html = readFileSync(join(process.cwd(), "app/plan-email/content.html"), "utf-8");

export async function GET() {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
