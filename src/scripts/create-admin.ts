import connectDB from '../lib/db';
import { User } from '../app/models/user.model';

async function promoteToAdmin(email: string) {
    try {
        await connectDB();

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        // Add admin role if not present
        if (!user.roles.includes('admin')) {
            user.roles.push('admin');
            await user.save();
            console.log(`Successfully promoted ${email} to admin`);
        } else {
            console.log(`${email} is already an admin`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address');
    process.exit(1);
}

promoteToAdmin(email); 