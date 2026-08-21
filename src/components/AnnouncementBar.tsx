import { announcement, seatsFilled, seatsTotal } from "@/content/site";

/* Full-width accent bar at the top of the page. Sized up so the seat
   count is the first thing read, with a slim fill gauge underneath. */
export default function AnnouncementBar() {
  const pct = Math.min(100, Math.round((seatsFilled / seatsTotal) * 100));
  return (
    <div className="bg-accent text-accent-on">
      <p className="px-4 py-3 text-center font-mono text-[12.5px] font-bold leading-snug tracking-[0.04em] sm:py-3.5 sm:text-[14px] sm:tracking-[0.08em]">
        {announcement}
      </p>
      <div
        aria-hidden
        className="h-[3px] w-full bg-[rgb(255_255_255/0.25)]"
      >
        <div className="h-full bg-white" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
