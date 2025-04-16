import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500
});

// Constants
const MAX_ANSWER_LENGTH = 100;
const MIN_ANSWER_LENGTH = 2;
const REQUIRED_QUESTIONS = 3;
const MIN_CORRECT_ANSWERS = 2;

// Predefined security questions
const SECURITY_QUESTIONS = [
    'What was the name of your first pet?',
    'In which city were you born?',
    'What was your mother\'s maiden name?',
    'What was the name of your first school?',
    'What is your favorite book?',
    'What was your childhood nickname?',
    'What is the name of the street you grew up on?',
    'What is your favorite movie?',
    'What was the make and model of your first car?',
    'What is your father\'s middle name?'
];

/**
 * @swagger
 * /api/auth/security/questions:
 *   get:
 *     summary: Get security questions
 *     description: Retrieve the list of available security questions for the user
 *     tags:
 *       - Security
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of security questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       question:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Set security questions
 *     description: Set or update security questions and answers for the user
 *     tags:
 *       - Security
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SecurityQuestionsRequest'
 *     responses:
 *       200:
 *         description: Security questions successfully set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Verify security questions
 *     description: Verify user's answers to security questions
 *     tags:
 *       - Security
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SecurityQuestionsVerification'
 *     responses:
 *       200:
 *         description: Security questions verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                   description: Reset token for password reset
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Incorrect answers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// GET: Retrieve user's security questions (without answers)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            questions: SECURITY_QUESTIONS
        });
    } catch (error) {
        console.error('Error in GET /api/auth/security/questions:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Set up security questions
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { questions } = body;

        // Validate request body
        if (!questions || !Array.isArray(questions) || questions.length !== REQUIRED_QUESTIONS) {
            return NextResponse.json(
                { success: false, message: `Invalid request: Exactly ${REQUIRED_QUESTIONS} questions required` },
                { status: 400 }
            );
        }

        // Validate each question and answer
        for (const q of questions) {
            if (!q.question || !q.answer ||
                typeof q.answer !== 'string' ||
                q.answer.trim().length < MIN_ANSWER_LENGTH ||
                q.answer.trim().length > MAX_ANSWER_LENGTH) {
                return NextResponse.json(
                    { success: false, message: `Invalid request: Each answer must be between ${MIN_ANSWER_LENGTH} and ${MAX_ANSWER_LENGTH} characters` },
                    { status: 400 }
                );
            }

            if (!SECURITY_QUESTIONS.includes(q.question)) {
                return NextResponse.json(
                    { success: false, message: 'Invalid request: Invalid security question provided' },
                    { status: 400 }
                );
            }
        }

        // Check for duplicate questions
        const uniqueQuestions = new Set(questions.map(q => q.question));
        if (uniqueQuestions.size !== REQUIRED_QUESTIONS) {
            return NextResponse.json(
                { success: false, message: 'Invalid request: Duplicate questions are not allowed' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        // Hash and store the security questions
        const hashedQuestions = await Promise.all(questions.map(async q => ({
            question: q.question,
            answer: await bcrypt.hash(q.answer.toLowerCase().trim(), 10)
        })));

        // Store the security questions
        await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.id) },
            {
                $set: {
                    securityQuestions: hashedQuestions,
                    updatedAt: new Date()
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Security questions updated successfully'
        });
    } catch (error) {
        console.error('Error in POST /api/auth/security/questions:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT: Verify security questions (for password reset)
export async function PUT(request: Request) {
    try {
        // Apply rate limiting
        try {
            await limiter.check(5, 'SECURITY_QUESTIONS_VERIFY'); // 5 requests per minute
        } catch {
            return NextResponse.json({
                success: false,
                message: 'Too many attempts. Please try again later.'
            }, { status: 429 });
        }

        const { email, answers } = await request.json();

        if (!email || !Array.isArray(answers)) {
            return NextResponse.json({
                success: false,
                message: 'Email and answers are required'
            }, { status: 400 });
        }

        // Validate answer lengths
        for (const answer of answers) {
            if (!answer.answer ||
                answer.answer.trim().length < MIN_ANSWER_LENGTH ||
                answer.answer.trim().length > MAX_ANSWER_LENGTH) {
                return NextResponse.json({
                    success: false,
                    message: `Answers must be between ${MIN_ANSWER_LENGTH} and ${MAX_ANSWER_LENGTH} characters`
                }, { status: 400 });
            }
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        const user = await users.findOne(
            { email: email.toLowerCase() },
            { projection: { securityQuestions: 1 } }
        );

        if (!user || !user.securityQuestions?.length) {
            return NextResponse.json({
                success: false,
                message: 'User not found or security questions not set'
            }, { status: 404 });
        }

        // Verify answers
        let correctAnswers = 0;
        for (let i = 0; i < answers.length; i++) {
            const storedQuestion = user.securityQuestions[i];
            if (storedQuestion) {
                const isMatch = await bcrypt.compare(
                    answers[i].answer.toLowerCase().trim(),
                    storedQuestion.answer
                );
                if (isMatch) correctAnswers++;
            }
        }

        // Require at least MIN_CORRECT_ANSWERS correct answers
        if (correctAnswers < MIN_CORRECT_ANSWERS) {
            return NextResponse.json({
                success: false,
                message: 'Incorrect answers provided'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Security questions verified successfully'
        });

    } catch (error) {
        console.error('Security questions verification error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to verify security questions'
        }, { status: 500 });
    }
} 