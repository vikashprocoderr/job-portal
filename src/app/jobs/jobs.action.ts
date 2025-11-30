"use server";

import { db } from "@/app/config/db";
import { jobs } from "@/drizzle/drizzle";
import { desc, isNull, eq } from "drizzle-orm";

export const getJobs = async () => {
  try {
    const jobsList = await db
      .select()
      .from(jobs)
      .where(isNull(jobs.deletedAt))
      .orderBy(desc(jobs.createdAt));

    return {
      status: "success",
      data: jobsList,
    };
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    return {
      status: "error",
      message: "Failed to fetch jobs",
      data: [],
    };
  }
};

export const getJobById = async (id: number) => {
  try {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id));

    if (!job) {
      return {
        status: "error",
        message: "Job not found",
      };
    }

    return {
      status: "success",
      data: job,
    };
  } catch (error) {
    console.error("❌ Error fetching job:", error);
    return {
      status: "error",
      message: "Failed to fetch job details",
    };
  }
};
