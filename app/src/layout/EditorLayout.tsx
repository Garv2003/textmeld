"use client";
import MarkdownEditor from '@/components/custom/MarkdownEditor';
import { ModeToggle } from '@/components/custom/MoonToggle';
import { Button } from '@/components/ui/button';
import { Link, useTransitionRouter } from 'next-view-transitions';
import { useEffect, useState } from 'react';
import { getUser, logout } from "@/actions/auth";
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export const EditorLayout = ({ id }: { id: string }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const { toast } = useToast()
    const router = useTransitionRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { user, error } = await getUser();
            if (user) {
                setUser(user);
            }
            if (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { error } = await logout();
        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
            setUser(null);
            return
        }
        toast({
            title: 'Success',
            description: 'Logout successful',
        })
        setUser(null);
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="w-full h-screen flex flex-col p-2 sm:p-4 lg:p-6">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 px-2 sm:px-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                        <Link href="/">
                            Markdown Editor
                        </Link>
                    </h1>
                    <div className='flex justify-end items-center gap-2'>
                        {!loading && (user ? <>
                            <Link href="/profile">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 transition-all hover:scale-105"
                                >
                                    Profile
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center gap-2 transition-all hover:scale-105"
                            >
                                Logout
                            </Button>
                        </>
                            : <Link href="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 transition-all hover:scale-105"
                                >
                                    Login
                                </Button>
                            </Link>)}
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex-1 rounded-lg bg-card text-card-foreground shadow-sm">
                    <MarkdownEditor id={id} user={user} loading={loading} />
                </div>
            </div >
        </div >
    );
};