import { prisma } from "./prisma";

// Match Prisma schema NotificationType enum
type NotificationType =
  | "BID_RECEIVED"
  | "BID_ACCEPTED"
  | "BID_REJECTED"
  | "LISTING_MATCHED"
  | "COLLECTION_SCHEDULED"
  | "COLLECTION_COMPLETED"
  | "CREDIT_EARNED"
  | "CREDIT_SOLD"
  | "KYC_APPROVED"
  | "KYC_REJECTED"
  | "REQUIREMENT_MATCHED"
  | "SYSTEM";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  data,
}: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type: type as any,
        title,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

export async function createBulkNotifications(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, unknown>
) {
  try {
    return await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: type as any,
        title,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      })),
    });
  } catch (error) {
    console.error("Failed to create bulk notifications:", error);
    return null;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return null;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return null;
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: { userId, read: false },
    });
  } catch (error) {
    console.error("Failed to get unread notification count:", error);
    return 0;
  }
}

export async function getUserNotifications(
  userId: string,
  limit: number = 20,
  cursor?: string
) {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });
  } catch (error) {
    console.error("Failed to get user notifications:", error);
    return [];
  }
}

export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    BID_RECEIVED: "🔔",
    BID_ACCEPTED: "✅",
    BID_REJECTED: "❌",
    LISTING_MATCHED: "🎯",
    COLLECTION_SCHEDULED: "📅",
    COLLECTION_COMPLETED: "✔️",
    CREDIT_EARNED: "🌱",
    CREDIT_SOLD: "💰",
    KYC_APPROVED: "✅",
    KYC_REJECTED: "❌",
    REQUIREMENT_MATCHED: "🤝",
    SYSTEM: "ℹ️",
  };
  return icons[type] || "📢";
}
