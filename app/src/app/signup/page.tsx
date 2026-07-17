"use client"
import { useTransitionRouter, Link } from 'next-view-transitions'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { registerFunction } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { z } from 'zod'
// import {
//     IconBrandGithub,
//     IconBrandGoogle,
// } from "@tabler/icons-react";

const registerSchema = z.object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
})

const SignUp = () => {
    const router = useTransitionRouter()
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit: SubmitHandler<z.infer<typeof registerSchema>> = async (data) => {
        const { firstname, lastname, email, password } = data
        setLoading(true);
        const { error } = await registerFunction(firstname, lastname, email, password)
        if (error) {
            toast({
                title: 'Registration failed',
                description: error.message,
                variant: 'destructive',
            })
            setLoading(false);
            return;
        }
        toast({
            title: 'Registration successful',
            description: 'You need to verify your email before you can login',
        })
        router.push('/login')
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Register to TextMeld
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    To start Editing and saving your readme
                </p>

                <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="firstname">First name</Label>
                            <Input id="firstname" placeholder="Tyler" type="text" {...register("firstname")} />
                            {errors.firstname && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.firstname.message}
                                </p>
                            )}
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="lastname">Last name</Label>
                            <Input id="lastname" placeholder="Durden" type="text" {...register("lastname")} />
                            {errors.lastname && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.lastname.message}
                                </p>
                            )}
                        </LabelInputContainer>
                    </div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" placeholder="projectmayhem@fc.com" type="email" {...register("email")} />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="••••••••" type="password" {...register("password")} />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-8">
                        <Label htmlFor="twitterpassword">confirm password</Label>
                        <Input
                            id="conifirmPassword"
                            placeholder="••••••••"
                            type="password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </LabelInputContainer>

                    <button
                        disabled={loading}
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        {loading ? "Signing up..." : "Sign up"}
                        <BottomGradient />
                    </button>

                    <div className="flex items-center justify-center mt-4">
                        <span className="text-neutral-600 dark:text-neutral-300 text-sm">
                            Already have an account?
                            <Link href="/login" className="underline ml-2">
                                Log in
                            </Link>
                        </span>
                    </div>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

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
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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

export default SignUp