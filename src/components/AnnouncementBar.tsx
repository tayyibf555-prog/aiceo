import { announcement } from "@/content/site";

/* Motif 4 (brief §3.4): full-width accent bar, white mono text, top of page. */
export default function AnnouncementBar() {
  return (
    <div className="bg-accent px-4 py-2 text-center font-mono text-[12px] tracking-[0.06em] text-accent-on">
      {announcement}
    </div>
  );
}
