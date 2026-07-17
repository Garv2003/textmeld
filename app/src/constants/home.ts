import { Edit3, Github, Share2, Download } from 'lucide-react';

export const navigation = [
    {
        name: "Editor",
        href: "/editor",
        icon: Edit3,
    },
    {
        name: "Login",
        href: "/login",
    },
    {
        name: "GitHub",
        href: "https://github.com/Garv2003/TextMeld",
        external: true,
        icon: Github,
    },
] satisfies { name: string; href: string; external?: boolean; icon?: any }[];

export const features = [
    {
        title: "Online Markdown Editor",
        description: "Write and edit your README files with our powerful markdown editor featuring live preview and syntax highlighting.",
        icon: Edit3,
    },
    {
        title: "Instant Sharing",
        description: "Share your documentation instantly with teammates through secure, shareable links.",
        icon: Share2,
    },
    {
        title: "Desktop App",
        description: "Download our desktop application for a seamless offline editing experience across all platforms.",
        icon: Download,
    },
];