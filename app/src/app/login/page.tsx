"use client"
import { useTransitionRouter, Link } from 'next-view-transitions'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { loginFunction } from '@/actions/auth';
import { cn } from "@/lib/utils";
import { useState } from "react";
import { z } from 'zod'
// import {
//     IconBrandGithub,
//     IconBrandGoogle,
// } from "@tabler/icons-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

const Login = () => {
    const router = useTransitionRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
        setLoading(true);
        const { error } = await loginFunction(data.email, data.password)
        if (error) {
            toast({
                title: 'Login failed',
                description: error.message,
                variant: 'destructive',
            })
            setLoading(false);
            return
        }
        toast({
            title: 'Login successful',
            description: 'You have successfully logged in',
        })
        setLoading(false);
        router.push('/profile');
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to TextMeld
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Login to TextMeld ,To start Editing your readme
                </p>

                <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" placeholder="projectmayhem@fc.com" type="email" {...register('email')} />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="••••••••" type="password" {...register('password')} />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </LabelInputContainer>
                    <button
                        disabled={loading}
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        {loading ? "Loading..." : "Login"}
                        <BottomGradient />
                    </button>

                    <div className="flex items-center justify-center mt-4">
                        <span className="text-neutral-600 dark:text-neutral-300 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="underline ml-2">
                                Sign up
                            </Link>
                        </span>
                    </div>

                    <div
                        className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent mb-8 mt-4 h-[1px] w-full" />

                    {/* <div className="flex flex-col space-y-4">
                        <button
                            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                            type="submit"
                        >
                            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                GitHub
                            </span>
                            <BottomGradient />
                        </button>
                        <button
                            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                            type="submit"
                        >
                            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                Google
                            </span>
                            <BottomGradient />
                        </button>
                    </div> */}
                </form>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span
                className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default Login;