'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfile {
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  links: {
    id: number;
    title: string;
    url: string;
    order: number;
    isActive: boolean;
  }[];
}

export default function Profile({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${params.username}`);
        if (!response.ok) throw new Error('Profile not found');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl text-white mb-2">Perfil não encontrado</h1>
          <p className="text-neutral-400">O usuário @{params.username} não existe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {profile.avatar && (
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={96}
              height={96}
              className="mx-auto rounded-full mb-4"
            />
          )}
          <h1 className="text-xl text-white font-medium mb-1">{profile.name}</h1>
          <p className="text-neutral-400 text-sm mb-4">@{profile.username}</p>
          {profile.bio && (
            <p className="text-neutral-300 text-sm">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {profile.links
            .filter(link => link.isActive)
            .sort((a, b) => a.order - b.order)
            .map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white hover:bg-neutral-800 transition-colors text-center"
              >
                {link.title}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
} 