'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCamera, FaUser, FaEnvelope, FaSave } from 'react-icons/fa';

interface ProfileData {
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
}

export default function UserProfile() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user) {
            router.push('/auth/signin');
            return;
        }
        fetchProfile();
    }, [session, router]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/user/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfileData(data);
            if (data.avatar) {
                setPreviewImage(data.avatar);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload avatar');

            const data = await response.json();
            setProfileData(prev => prev ? { ...prev, avatar: data.avatarUrl } : null);
            setSuccess('Avatar updated successfully');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center">
                    <FaUser className="mr-2" /> My Profile
                </h1>

                <div className="bg-white shadow-md rounded-lg p-6">
                    {/* Avatar Section */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {previewImage ? (
                                    <Image
                                        src={previewImage}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-gray-400">
                                        {profileData?.username?.[0]?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                            >
                                <FaCamera className="h-4 w-4" />
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={profileData?.username || ''}
                                    onChange={(e) => setProfileData(prev => ({ ...prev!, username: e.target.value }))}
                                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={profileData?.email || ''}
                                    onChange={(e) => setProfileData(prev => ({ ...prev!, email: e.target.value }))}
                                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                value={profileData?.bio || ''}
                                onChange={(e) => setProfileData(prev => ({ ...prev!, bio: e.target.value }))}
                                rows={4}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-green-500 text-sm bg-green-50 p-3 rounded-md">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave className="mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 