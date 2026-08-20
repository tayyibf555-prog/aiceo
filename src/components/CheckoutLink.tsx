"use client";

/*
  The cohort checkout CTA. External Commas checkout, so the click event
  is the last thing we see on-site: tracked per the all-things-tracked
  rule. Styling matches Button's primary look at full width.
*/
import { track } from "@vercel/analytics";
import { trackEvent } from "@/lib/track";
import { checkoutUrl } from "@/content/site";

export default function CheckoutLink({
  cta,
  location,
}: {
  cta: string;
  location: string;
}) {
  return (
    <a
      href={checkoutUrl}
      onClick={() => {
        track("checkout_click", { location });
        trackEvent("checkout_click", { location });
      }}
      className="block w-full rounded-lg bg-accent px-6 py-3.5 text-center font-bold text-accent-on shadow-[3px_3px_0_rgba(10,10,10,0.9)] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-accent-hover hover:shadow-[2px_2px_0_rgba(10,10,10,0.9)]"
    >
      {cta}
      <span className="ml-2">→</span>
    </a>
  );
}
