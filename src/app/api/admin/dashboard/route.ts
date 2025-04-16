import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/middleware/roleMiddleware';

export async function GET(request: NextRequest) {
    const authCheck = await verifyAdmin(request);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        // Mock admin dashboard data
        const dashboardData = {
            totalUsers: 1250,
            activeUsers: 980,
            suspendedUsers: 45,
            newUsersToday: 25,
            systemHealth: {
                cpuUsage: "45%",
                memoryUsage: "60%",
                diskSpace: "75%",
                lastBackup: "2024-03-20T10:00:00Z"
            },
            recentActions: [
                {
                    id: 1,
                    action: "User suspended",
                    timestamp: "2024-03-20T09:45:00Z",
                    admin: "admin@example.com"
                },
                {
                    id: 2,
                    action: "Backup completed",
                    timestamp: "2024-03-20T10:00:00Z",
                    admin: "system"
                }
            ]
        };

        return NextResponse.json(dashboardData, { status: 200 });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        return NextResponse.json(
            { message: 'Error fetching admin dashboard data' },
            { status: 500 }
        );
    }
} 