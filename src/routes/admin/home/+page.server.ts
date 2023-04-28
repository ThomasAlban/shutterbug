import db from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export async function load() {
  return {
    // get all reports
    reports: await db.report.findMany(),
  };
}

export const actions = {
  async delete({ url }) {
    const reporterID = url.searchParams.get("reporterID");
    const culpritID = url.searchParams.get("culpritID");

    if (!reporterID || !culpritID) return fail(400);

    try {
      await db.report.delete({
        where: {
          reporterID_culpritID: {
            reporterID,
            culpritID,
          },
        },
      });
    } catch (error) {
      return fail(500, { error });
    }
    return {
      status: 200,
    };
  },
};
