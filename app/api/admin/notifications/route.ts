import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get("unread") === "true";

        const notifications = await prisma.notification.findMany({
            where: unreadOnly ? { read: false } : {},
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return NextResponse.json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, readAll } = body;

        if (readAll) {
            await prisma.notification.updateMany({
                where: { read: false },
                data: { read: true },
            });
        } else if (id) {
            await prisma.notification.update({
                where: { id: parseInt(id) },
                data: { read: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ success: false, error: "Failed to update notifications" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, deleteAll } = body;

        if (deleteAll) {
            await prisma.notification.deleteMany({});
        } else if (id) {
            await prisma.notification.delete({
                where: { id: parseInt(id) },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return NextResponse.json({ success: false, error: "Failed to delete notifications" }, { status: 500 });
    }
}
