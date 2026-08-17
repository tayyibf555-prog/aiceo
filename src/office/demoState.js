/*
  Mode JSONs. The renderer is pure: these files are the entire contract.
  demo = website mode: everything lit, corridor locked, example badge.
*/
export const DEMO_STATE = {
  mode: "demo",
  business: "EXAMPLE OFFICE",
  rooms: {
    boardroom: { state: "lit" },
    reception: { state: "lit" },
    archive: { state: "lit" },
    corner: { state: "lit" },
  },
};

/* A scan-result example (kept for the Gap Scan product; not rendered
   on the site yet): most of the building dark, plaques stamped. */
export const SCAN_EXAMPLE = {
  mode: "scan",
  business: "YOUR OFFICE",
  score: "3/16",
  rooms: {
    boardroom: {
      state: "dark",
      fixtures: { table: "lit", intray: "lit", rulebook: "dark", chair: "dark", phone: "lit" },
    },
    reception: { state: "dark", plaque: "NOBODY ANSWERS AFTER 6PM" },
    archive: { state: "dark", plaque: "2 YEARS OF LEADS ASLEEP" },
    corner: { state: "dark", plaque: "NOTHING RUNS THE DAY" },
  },
};
