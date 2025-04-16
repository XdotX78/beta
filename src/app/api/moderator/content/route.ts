import { NextRequest, NextResponse } from 'next/server';
import { verifyModerator } from '@/middleware/roleMiddleware';

export async function GET(request: NextRequest) {
    const authCheck = await verifyModerator(request);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        // Mock content management data
        const contentData = {
            pendingReviews: 15,
            flaggedContent: 8,
            recentReports: [
                {
                    id: 1,
                    type: "comment",
                    reason: "inappropriate content",
                    timestamp: "2024-03-20T08:30:00Z",
                    status: "pending"
                },
                {
                    id: 2,
                    type: "post",
                    reason: "spam",
                    timestamp: "2024-03-20T09:15:00Z",
                    status: "pending"
                }
            ],
            moderationStats: {
                todayReviewed: 45,
                todayApproved: 38,
                todayRejected: 7
            }
        };

        return NextResponse.json(contentData, { status: 200 });
    } catch (error) {
        console.error('Content management error:', error);
        return NextResponse.json(
            { message: 'Error fetching content management data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authCheck = await verifyModerator(request);
    if (authCheck instanceof NextResponse) {
        return authCheck;
    }

    try {
        const data = await request.json();

        // Mock content moderation action
        const response = {
            success: true,
            action: data.action,
            contentId: data.contentId,
            timestamp: new Date().toISOString(),
            moderator: "moderator@example.com"
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Content moderation error:', error);
        return NextResponse.json(
            { message: 'Error processing moderation action' },
            { status: 500 }
        );
    }
} 