import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserCircle2, Pencil, Upload } from 'lucide-react';
import { uploadProfileImage } from "@/actions/file";
import { Button } from "@/components/ui/button";
import { updateAvatar } from "@/actions/auth"
import { useToast } from "@/hooks/use-toast";
import React from 'react';

interface AvatarUploadProps {
    avatar?: string;
    userId: string;
    setAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
}

const AvatarUpload = ({ avatar, userId, setAvatarUrl }: AvatarUploadProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { toast } = useToast();

    React.useEffect(() => {
        if (avatar) {
            setAvatarUrl(avatar);
        }
    }, [avatar]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarUrl(URL.createObjectURL(file));
            setIsDialogOpen(true);
        }
    };

    const handleFileUpload = async () => {
        setLoading(true);
        const { publicURL, error } = await uploadProfileImage(
            fileInputRef.current?.files?.[0] as File
        );
        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
            setLoading(false);
            setIsDialogOpen(false);
            return;
        }
        const { error: updateError } = await updateAvatar(publicURL, userId);
        if (updateError) {
            toast({
                title: 'Error',
                description: updateError.message,
                variant: 'destructive',
            })
            setLoading(false);
            setIsDialogOpen(false);
            return;
        }
        toast({
            title: 'Success',
            description: 'Profile picture updated successfully',
        })
        setAvatarUrl(publicURL);
        setIsDialogOpen(false);
        setLoading(false);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative group">
            <div className="relative w-20 h-20 rounded-full  bg-zinc-800">
                {avatar ? (
                    <img
                        src={avatar}
                        alt="User avatar"
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <UserCircle2 className="w-full h-full" />
                    </div>
                )}
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={triggerFileInput}
                >
                    <Pencil className="w-3 h-3 text-white" />
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Update profile picture</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32 rounded-full overflow-hidden">
                                            {avatar ? (
                                                <img
                                                    src={avatar}
                                                    alt="Current avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                    <UserCircle2 className="w-full h-full" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={handleFileUpload}
                                            className="flex items-center gap-2"
                                            disabled={loading}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {loading ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit profile picture</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export { AvatarUpload };