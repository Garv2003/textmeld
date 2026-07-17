"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchReadme, updateReadme, changeReadmeName } from "@/actions/db";
import { Download, Upload, FileText, Copy } from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@supabase/supabase-js";
import 'highlight.js/styles/github-dark.css';
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils";
import showdown from 'showdown';

const MarkdownEditor: React.FC<{ id: string; user: User | null, loading: boolean }> = ({ id, user, loading }: { id: string; user: User | null, loading: boolean }) => {
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
    const [loadingFile, setLoadingFile] = useState(true);
    const [readmeName, setReadmeName] = useState<string>('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [markdown, setMarkdown] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const getMarkdownPreview = () => {
        const converter = new showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true
        });
        return { __html: converter.makeHtml(markdown) };
    };

    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);

        if (user) {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }

            const timeout = setTimeout(() => {
                handleSave();
            }, 2000);
            setAutoSaveTimeout(timeout);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
            title: 'Download successful',
            description: 'Your document has been downloaded successfully',
        })
    };

    const handleCipboardClick = async () => {
        setIsCopied(true);
        await navigator.clipboard.writeText(markdown);
        toast({
            title: 'Copied to clipboard',
            description: 'Your document has been copied to the clipboard',
        })
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    setMarkdown(content);
                }
            };
            reader.readAsText(file);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.markdown'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    setMarkdown(content);
                }
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {
        const fetchReadmeData = async () => {
            setLoadingFile(true);
            if (user) {
                const { data, error } = await fetchReadme(id, user.id);
                if (data && data.length > 0) {
                    setReadmeName(data[0].name);
                    setMarkdown(data[0].content);
                }
                if (error) {
                    toast({
                        title: 'Error',
                        description: error.message,
                        variant: 'destructive',
                    })
                }
            }
            setLoadingFile(false);
        };
        fetchReadmeData();
    }, [id, user]);

    useEffect(() => {
        return () => {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }
        };
    }, [autoSaveTimeout]);

    const handleSave = async () => {
        setSaveLoading(true);
        if (!user) {
            toast({
                title: 'Error',
                description: 'You are not logged in',
                variant: 'destructive',
            })
            setSaveLoading(false);
            return;
        }
        const { error } = await updateReadme(id, markdown);
        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            })
            setSaveLoading(false);
            return;
        }
        toast({
            title: 'Saved',
            description: 'Your document has been saved successfully',
        })
        setSaveLoading(false);
    };

    function debounce<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timer: ReturnType<typeof setTimeout>;

        return (...args: Parameters<T>) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    const handleChangeReadmeName = async (name: string) => {
        setReadmeName(name);
        handleNameChange(name);
    };

    const handleNameChange = debounce(async (name: string) => {
        if (user) {
            const { error } = await changeReadmeName(id, name);
            if (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                })
            }
        }
    }, 1000);

    if (loading || loadingFile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-4 border-dotted rounded-full animate-spin border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-4 py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm font-medium">
                        {markdown ? `${markdown.split(' ').length} words` : 'No content'}
                    </span>
                    <Input
                        type="text"
                        value={readmeName}
                        onChange={(e) => handleChangeReadmeName(e.target.value)}
                        className="bg-transparent text-sm font-medium text-muted-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".md,.markdown"
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={!markdown || saveLoading}
                        className="flex items-center gap-2 transition-all hover:scale-105"
                    >
                        {saveLoading ? (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <>
                                <FileText className="h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCipboardClick}
                        disabled={!markdown || isCopied}
                        className="flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Copy className="h-4 w-4" />
                        {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2 transition-all hover:scale-105"
                        disabled={!markdown}
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <div className="hidden md:flex flex-1 p-4">
                <div className="grid grid-cols-2 gap-6 h-full w-full">
                    <Card className="flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Editor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <div
                                className={cn(
                                    "relative h-full p-4",
                                    isDragging && "ring-2 ring-primary"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {isDragging && (
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-50">
                                        <p className="text-lg font-medium">Drop your markdown file here</p>
                                    </div>
                                )}
                                <Textarea
                                    value={markdown}
                                    onChange={handleMarkdownChange}
                                    placeholder="Write your markdown here..."
                                    className="h-full font-mono resize-none focus-visible:ring-1 bg-background transition-colors duration-200"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[70vh] flex-1 p-0">
                            <ScrollArea className="p-4 pb-2 bg-background">
                                <div
                                    className="min-h-[626px] w-full prose prose-sm dark:prose-invert max-w-none border flex-1 rounded-md p-2 animate-in fade-in duration-200"
                                    dangerouslySetInnerHTML={getMarkdownPreview()}
                                />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="block md:hidden flex-1">
                <Tabs defaultValue="editor" className="flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor" className="transition-all data-[state=active]:font-medium">Editor</TabsTrigger>
                        <TabsTrigger value="preview" className="transition-all data-[state=active]:font-medium">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="flex-1 mt-2 data-[state=active]:flex">
                        <Card className="flex flex-col flex-1">
                            <CardContent className="flex-1 p-4">
                                <div
                                    className={cn(
                                        "relative h-full",
                                        isDragging && "ring-2 ring-primary"
                                    )}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {isDragging && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-50">
                                            <p className="text-lg font-medium">Drop your markdown file here</p>
                                        </div>
                                    )}
                                    <Textarea
                                        value={markdown}
                                        onChange={handleMarkdownChange}
                                        placeholder="Write your markdown here..."
                                        className="h-full font-mono bg-background scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500 transition-colors duration-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="preview" className="flex-1 mt-2 data-[state=active]:flex">
                        <Card className="flex flex-col flex-1">
                            <CardContent className="flex-1 p-4">
                                <ScrollArea className="h-full bg-background scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
                                    <div
                                        className="h-[68vh] prose prose-sm dark:prose-invert max-w-none animate-in fade-in duration-200"
                                        dangerouslySetInnerHTML={getMarkdownPreview()}
                                    />
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MarkdownEditor;
