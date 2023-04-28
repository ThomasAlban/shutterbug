import db from "$lib/server/db";

export async function load() {
  return {
    // get all reports
    reports: await db.report.findMany(),
  };
}
