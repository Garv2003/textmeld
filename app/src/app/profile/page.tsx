"use client";
import { ModeToggle } from '@/components/custom/MoonToggle';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from 'next-view-transitions';
import React, { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Trash2,
    Edit2,
    User,
    LogOut,
    Clock,
    // Share2,
    // Eye
} from 'lucide-react';
import { getUserById, getUser, logout } from "@/actions/auth";
import { fetchReadmes, deleteReadme } from "@/actions/db";
import { useToast } from '@/hooks/use-toast';
import { useTransitionRouter } from 'next-view-transitions';
import type { User as UserType, Readme } from '@/types/profile';
import { AvatarUpload } from "@/components/custom/AvatarUpload";

export default function ReadmeList() {
    const [avatarUrl, setAvatarUrl] = React.useState<string>('');
    const [readmeFiles, setReadmeFiles] = useState<Readme[]>([])
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useTransitionRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { user, error: authError } = await getUser();
            if (!user || authError) {
                toast({
                    title: 'Error',
                    description: 'You are not logged in',
                    variant: 'destructive',
                })
                router.push('/login');
                return;
            }
            const { data: userInfo, error: userError } = await getUserById(user.id);
            if (!userInfo || userError) {
                toast({
                    title: 'Error',
                    description: 'You are not logged in',
                    variant: 'destructive',
                })
                router.push('/login');
                return;
            }
            setUser(userInfo[0]);
            setAvatarUrl(userInfo[0].avatar);
            const { data: readmeFiles, error: readmeError } = await fetchReadmes(userInfo[0].userId);
            if (!readmeFiles || readmeError) {
                toast({
                    title: 'Error',
                    description: 'You are not logged in',
                    variant: 'destructive',
                })
                router.push('/login');
                return;
            }
            setReadmeFiles(readmeFiles);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleDeleteFile = async (id: string) => {
        const { error } = await deleteReadme(id);
        if (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive',
            })
            return;
        }
        setReadmeFiles(readmeFiles.filter(file => file.readme_id !== id));
        toast({
            title: 'Deleted',
            description: 'Your document has been deleted successfully',
        })
    };

    const handleLogout = async () => {
        const { error } = await logout();
        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
            return
        }
        toast({
            title: 'Success',
            description: 'Logout successful',
        })
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-dotted rounded-full animate-spin border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <header className="top-0 z-30 w-full px-4 fixed backdrop-blur bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <Link href="/" className="text-3xl font-bold text-zinc-900 dark:text-white duration-150 hover:text-blue-600 dark:hover:text-blue-400">
                            TextMeld
                        </Link>
                        <nav className="flex items-center space-x-3">
                            <ul className="flex items-center">
                                <li>
                                    <Link
                                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 duration-150 hover:text-blue-600 dark:hover:text-blue-400"
                                        href="/editor"
                                    >
                                        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New README
                                        </Button>
                                    </Link>
                                </li>
                                <li>
                                    <Button
                                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </Button>
                                </li>
                            </ul>
                            <ModeToggle />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                {/* User Info Section */}
                <div className="bg-zinc-900 rounded-lg p-6 mb-8 border border-zinc-800">
                    <div className="flex items-center space-x-4">
                        <AvatarUpload avatar={avatarUrl} userId={user!.userId} setAvatarUrl={setAvatarUrl} />
                        <div>
                            <h2 className="text-xl font-bold text-white">{user!.firstname + " " + user!.lastname}</h2>
                            <p className="text-sm text-zinc-400">{user!.email}</p>
                            <p className="text-sm text-zinc-400">Joined {new Date(user!.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* README Files List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {readmeFiles.map((file, index) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-5 h-5 text-zinc-400" />
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                {file.name}
                                            </h3>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {user!.firstname + " " + user!.lastname}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                Updated {new Date(file.update_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8 border-zinc-700 hover:bg-zinc-800"
                                        >
                                            <Share2 className="w-4 h-4 text-zinc-400" />
                                        </Button> */}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8 border-zinc-700 hover:bg-zinc-800"
                                        >
                                            <Link href={`/editor/${file.readme_id}`}>
                                                <Edit2 className="w-4 h-4 text-zinc-400" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8 border-zinc-700 hover:bg-red-900/30 text-red-400"
                                            onClick={() => handleDeleteFile(file.readme_id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Empty State */}
                    {readmeFiles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800"
                        >
                            <FileText className="w-12 h-12 mx-auto text-zinc-400" />
                            <h3 className="mt-4 text-lg font-medium text-white">No README files yet</h3>
                            <p className="mt-2 text-zinc-400">Create your first README file to get started</p>
                            <Button
                                className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create README
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}