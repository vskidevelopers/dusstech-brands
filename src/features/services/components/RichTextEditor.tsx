'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import {
    Bold, Italic, List, ListOrdered, Strikethrough, Quote, Undo, Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// MOVE THIS OUTSIDE THE COMPONENT
interface ToolbarButtonProps {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    label: string;
}

function ToolbarButton({ onClick, active, children, label }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', active && 'bg-accent text-accent-foreground')}
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
        >
            {children}
        </Button>
    );
}

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: placeholder ?? 'Write something...' }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    'prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="overflow-hidden rounded-md border focus-within:ring-1 focus-within:ring-ring">
            <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    label="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <div className="mx-1 h-5 w-px bg-border" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    label="Bullet list"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    label="Ordered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    label="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <div className="mx-1 h-5 w-px bg-border" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}