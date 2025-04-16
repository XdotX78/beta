import React from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
    const calculateStrength = (password: string): number => {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 10;

        // Character variety checks
        if (/[A-Z]/.test(password)) strength += 20; // Uppercase
        if (/[a-z]/.test(password)) strength += 20; // Lowercase
        if (/[0-9]/.test(password)) strength += 20; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) strength += 10; // Special characters

        return Math.min(strength, 100);
    };

    const getStrengthText = (strength: number): string => {
        if (strength < 30) return 'Very Weak';
        if (strength < 50) return 'Weak';
        if (strength < 70) return 'Moderate';
        if (strength < 90) return 'Strong';
        return 'Very Strong';
    };

    const getStrengthColor = (strength: number): string => {
        // Gradient colors from red to green
        if (strength < 30) return 'from-red-500 to-red-600';
        if (strength < 50) return 'from-orange-500 to-orange-600';
        if (strength < 70) return 'from-yellow-500 to-yellow-600';
        if (strength < 90) return 'from-lime-500 to-lime-600';
        return 'from-green-500 to-green-600';
    };

    const strength = calculateStrength(password);
    const strengthText = getStrengthText(strength);
    const strengthColor = getStrengthColor(strength);

    return (
        <div className="w-full space-y-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${strengthColor} transition-all duration-300 ease-in-out`}
                    style={{ width: `${strength}%` }}
                />
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${strength > 69 ? 'text-green-600' : 'text-gray-600'}`}>
                    {strengthText}
                </span>
                <span className="text-gray-500">
                    {strength}%
                </span>
            </div>
            {strength < 70 && (
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    {password.length < 8 && (
                        <li className="flex items-center">
                            <span className="text-red-500 mr-1">•</span>
                            At least 8 characters
                        </li>
                    )}
                    {!/[A-Z]/.test(password) && (
                        <li className="flex items-center">
                            <span className="text-red-500 mr-1">•</span>
                            Include uppercase letter
                        </li>
                    )}
                    {!/[a-z]/.test(password) && (
                        <li className="flex items-center">
                            <span className="text-red-500 mr-1">•</span>
                            Include lowercase letter
                        </li>
                    )}
                    {!/[0-9]/.test(password) && (
                        <li className="flex items-center">
                            <span className="text-red-500 mr-1">•</span>
                            Include number
                        </li>
                    )}
                    {!/[^A-Za-z0-9]/.test(password) && (
                        <li className="flex items-center">
                            <span className="text-red-500 mr-1">•</span>
                            Include special character
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator; 