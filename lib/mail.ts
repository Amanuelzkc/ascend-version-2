// Admin email to receive notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ascend.com";

/**
 * In a real application, you would use nodemailer or a service like Resend/SendGrid.
 * For now, we simulate sending an email by logging it to the console.
 */
export async function sendAdminNotificationEmail(subject: string, html: string) {
    console.log("====================================================");
    console.log(`SENDING EMAIL TO ADMIN: ${ADMIN_EMAIL}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("----------------------------------------------------");
    console.log("CONTENT:");
    console.log(html.replace(/<[^>]*>?/gm, '')); // Strip HTML for console log
    console.log("====================================================");

    // Simulated success
    return { success: true };
}
