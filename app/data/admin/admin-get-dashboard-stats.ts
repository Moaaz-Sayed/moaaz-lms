import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalSignUps, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      //total signUps
      prisma.user.count(),

      //total Customers
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),

      //total Courses
      prisma.course.count({}),

      //total Lessons
      prisma.lesson.count({}),
    ]);

  return { totalSignUps, totalCustomers, totalCourses, totalLessons };
}
