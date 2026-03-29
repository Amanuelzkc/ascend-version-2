import prisma from "./prisma";
import { sendAdminNotificationEmail } from "./mail";

export type NotificationType = "JOB_APPLICATION" | "GENERAL_APPLICATION";

export async function createAdminNotification({
    type,
    title,
    message,
    link,
}: {
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}) {
    try {
        // 1. Create notification in database
        const notification = await prisma.notification.create({
            data: {
                type,
                title,
                message,
                link,
            },
        });

        // 2. Send email notification (asynchronous, don't block the request)
        // In a production app, we would use a background worker/queue
        const emailSubject = `[Ascend Admin] New ${type === "JOB_APPLICATION" ? "Job Application" : "General CV Submit"}: ${title}`;
        const emailHtml = `
      <h2>New Application Received</h2>
      <p><b>Type:</b> ${type === "JOB_APPLICATION" ? "Job Application" : "General CV Submission"}</p>
      <p><b>Title:</b> ${title}</p>
      <p><b>Message:</b> ${message}</p>
      ${link ? `<p><a href="${process.env.NEXT_PUBLIC_APP_URL || ''}${link}">View in Dashboard</a></p>` : ""}
    `;

        // We don't await this to keep the API response fast
        sendAdminNotificationEmail(emailSubject, emailHtml).catch((err) => {
            console.error("Failed to send notification email:", err);
        });

        return notification;
    } catch (error) {
        console.error("Error creating admin notification:", error);
        // We don't throw here to avoid failing the main application submission
        return null;
    }
}
