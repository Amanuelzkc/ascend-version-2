"use client"

import React, { useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import { Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Type,
    Palette,
    Eraser,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Image as ImageIcon,
    Video as VideoIcon,
    Table as TableIcon,
    Plus,
    Minus,
    Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ── Custom font-size extension ────────────────────────────────────
// Adds a fontSize attribute to TextStyle so we can set arbitrary px sizes.
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] } },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: el => el.style.fontSize || null,
                    renderHTML: attrs => {
                        if (!attrs.fontSize) return {}
                        return { style: `font-size: ${attrs.fontSize}` }
                    },
                },
            },
        }]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) =>
                chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }: any) =>
                chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        } as any
    },
})
// ─────────────────────────────────────────────────────────────────

const Separator = ({ className, orientation = "vertical" }: { className?: string, orientation?: "vertical" | "horizontal" }) => (
    <SeparatorPrimitive.Root
        orientation={orientation}
        className={`${className} ${orientation === "vertical" ? "w-[1px] h-full" : "h-[1px] w-full"} bg-white/10`}
    />
)

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = ({ children, className, ...props }: any) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            className={`z-50 rounded-md border bg-[#334155] p-4 text-white shadow-md outline-none border-white/10 ${className}`}
            {...props}
        >
            {children}
        </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
)

// ── Table size picker popover ─────────────────────────────────────
const GRID_MAX = 10

const TablePickerPopover = ({ editor }: { editor: any }) => {
    const [hoverRow, setHoverRow] = React.useState(0)
    const [hoverCol, setHoverCol] = React.useState(0)
    const [open, setOpen] = React.useState(false)
    const inTable = editor?.isActive('table')

    const handleInsert = (rows: number, cols: number) => {
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
        setOpen(false)
    }

    const action = (fn: () => void) => { fn(); setOpen(false) }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${inTable ? 'bg-white/20 text-white' : 'text-white/60'}`}
                    title="Table"
                >
                    <TableIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-auto min-w-[200px]" sideOffset={6}>
                {/* ── Grid Picker ── */}
                <p className="text-xs text-white/50 font-medium uppercase tracking-wide mb-2">
                    {hoverRow > 0 && hoverCol > 0 ? `${hoverRow} × ${hoverCol} table` : 'Insert Table'}
                </p>
                <div
                    className="grid gap-0.5 mb-3"
                    style={{ gridTemplateColumns: `repeat(${GRID_MAX}, 1.4rem)` }}
                    onMouseLeave={() => { setHoverRow(0); setHoverCol(0) }}
                >
                    {Array.from({ length: GRID_MAX }, (_, r) =>
                        Array.from({ length: GRID_MAX }, (_, c) => (
                            <div
                                key={`${r}-${c}`}
                                onMouseEnter={() => { setHoverRow(r + 1); setHoverCol(c + 1) }}
                                onClick={() => handleInsert(r + 1, c + 1)}
                                className={`h-5 w-5 rounded-sm border cursor-pointer transition-colors ${r < hoverRow && c < hoverCol
                                    ? 'bg-blue-400/40 border-blue-400'
                                    : 'bg-white/[0.04] border-white/10 hover:bg-white/10'
                                    }`}
                            />
                        ))
                    )}
                </div>

                {/* ── Contextual controls (visible only inside a table) ── */}
                {inTable && (
                    <>
                        <div className="h-px bg-white/10 mb-2" />
                        <div className="flex flex-col gap-0.5">
                            {/* Rows */}
                            <p className="text-xs text-white/40 px-1 pb-0.5 uppercase tracking-wide">Rows</p>
                            <button type="button" onClick={() => action(() => editor.chain().focus().addRowBefore().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <Plus className="h-3 w-3 text-white/50" /> Add Row Before
                            </button>
                            <button type="button" onClick={() => action(() => editor.chain().focus().addRowAfter().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <Plus className="h-3 w-3 text-white/50" /> Add Row After
                            </button>
                            <button type="button" onClick={() => action(() => editor.chain().focus().deleteRow().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-red-400 text-left">
                                <Minus className="h-3 w-3" /> Delete Row
                            </button>
                            {/* Columns */}
                            <div className="h-px bg-white/10 my-1" />
                            <p className="text-xs text-white/40 px-1 pb-0.5 uppercase tracking-wide">Columns</p>
                            <button type="button" onClick={() => action(() => editor.chain().focus().addColumnBefore().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <Plus className="h-3 w-3 text-white/50" /> Add Column Before
                            </button>
                            <button type="button" onClick={() => action(() => editor.chain().focus().addColumnAfter().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <Plus className="h-3 w-3 text-white/50" /> Add Column After
                            </button>
                            <button type="button" onClick={() => action(() => editor.chain().focus().deleteColumn().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-red-400 text-left">
                                <Minus className="h-3 w-3" /> Delete Column
                            </button>
                            {/* Cells */}
                            <div className="h-px bg-white/10 my-1" />
                            <p className="text-xs text-white/40 px-1 pb-0.5 uppercase tracking-wide">Cells</p>
                            <button type="button" onClick={() => action(() => editor.chain().focus().mergeCells().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <TableIcon className="h-3 w-3 text-white/50" /> Merge Selected Cells
                            </button>
                            <button type="button" onClick={() => action(() => editor.chain().focus().splitCell().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <TableIcon className="h-3 w-3 text-white/50" /> Split Cell
                            </button>
                            <button type="button" onClick={() => action(() => editor.chain().focus().toggleHeaderCell().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-white/10 text-white text-left">
                                <TableIcon className="h-3 w-3 text-white/50" /> Toggle Header Cell
                            </button>
                            {/* Delete table */}
                            <div className="h-px bg-white/10 my-1" />
                            <button type="button" onClick={() => action(() => editor.chain().focus().deleteTable().run())}
                                className="flex items-center gap-2 px-2 py-1 text-xs rounded hover:bg-red-500/20 text-red-400 text-left">
                                <Trash2 className="h-3 w-3" /> Delete Table
                            </button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}
// ─────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    const [, setUpdate] = React.useState(0)
    const [isVideoPopoverOpen, setIsVideoPopoverOpen] = React.useState(false)
    const [videoUrlInput, setVideoUrlInput] = React.useState('')

    React.useEffect(() => {
        if (!editor) return

        const update = () => setUpdate(n => n + 1)

        editor.on('selectionUpdate', update)
        editor.on('transaction', update)

        return () => {
            editor.off('selectionUpdate', update)
            editor.off('transaction', update)
        }
    }, [editor])

    if (!editor) {
        return null
    }

    const addLink = () => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Upload failed')

            const data = await response.json()
            if (data.url) {
                editor.chain().focus().setImage({ src: data.url }).run()
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try again.')
        } finally {
            // Reset input
            event.target.value = ''
        }
    }

    const getYouTubeId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/)
        return match ? match[1] : null
    }

    const submitVideo = (e: React.FormEvent) => {
        e.preventDefault()
        if (videoUrlInput) {
            const ytId = getYouTubeId(videoUrlInput)
            const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
            // @ts-ignore - custom command
            editor.chain().focus().setVideo({ src: videoUrlInput, thumbnail }).run()
            setIsVideoPopoverOpen(false)
            setVideoUrlInput('')
        }
    }

    const fonts = [
        { label: 'Default', value: 'Inter' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Arial', value: 'Arial' },
        { label: 'Verdana', value: 'Verdana' },
        { label: 'Ethiopic Sans', value: 'var(--font-amharic-sans)' },
        { label: 'Ethiopic Serif', value: 'var(--font-amharic-serif)' },
        { label: 'Ethiopic Menbere', value: 'var(--font-amharic-menbere)' },
        { label: 'Ethiopic Traditional', value: 'var(--font-amharic-abyssinica)' },
        { label: 'Ethiopic Gurzada', value: 'var(--font-amharic-gurzada)' },
        { label: 'Ethiopic Kafiyl', value: 'var(--font-amharic-kafiyl)' },
        { label: 'Monospace', value: 'Courier New' },
    ]

    const colors = [
        '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
        '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
        '#8b5cf6', '#d946ef', '#ec4899', '#64748b'
    ]

    const highlights = [
        '#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#ddd6fe', '#fed7aa'
    ]

    return (
        <div className={`flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/40 backdrop-blur-md sticky z-50 rounded-t-lg transition-all duration-300 top-[96px] lg:top-[112px] editor-toolbar`}>
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 1 }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 3 }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <AlignJustify className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/60"
                        >
                            <Type className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2">
                        <div className="grid grid-cols-4 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className="h-6 w-6 rounded border border-white/10"
                                    style={{ backgroundColor: color }}
                                    onClick={() => editor.chain().focus().setColor(color).run()}
                                />
                            ))}
                            <button
                                type="button"
                                className="h-6 w-6 rounded border border-white/10 flex items-center justify-center bg-transparent text-white"
                                onClick={() => editor.chain().focus().unsetColor().run()}
                            >
                                <Eraser className="h-3 w-3" />
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/60"
                        >
                            <Palette className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2">
                        <div className="grid grid-cols-3 gap-1">
                            {highlights.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className="h-6 w-full rounded border border-white/10"
                                    style={{ backgroundColor: color }}
                                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                                />
                            ))}
                            <button
                                type="button"
                                className="h-6 w-full rounded border border-white/10 flex items-center justify-center bg-transparent text-white"
                                onClick={() => editor.chain().focus().unsetHighlight().run()}
                            >
                                <Eraser className="h-3 w-3" />
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-white/60 flex items-center gap-1"
                        >
                            <Type className="h-4 w-4" />
                            <span className="text-xs">Font</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2">
                        <div className="flex flex-col gap-1">
                            {fonts.map((font) => (
                                <button
                                    key={font.value}
                                    type="button"
                                    className={`text-left px-2 py-1 text-sm rounded hover:bg-white/10 ${editor.isActive('textStyle', { fontFamily: font.value }) ? 'bg-white/20' : ''}`}
                                    style={{ fontFamily: font.value }}
                                    onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                                >
                                    {font.label}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="text-left px-2 py-1 text-sm rounded hover:bg-white/10 text-white/60"
                                onClick={() => editor.chain().focus().unsetFontFamily().run()}
                            >
                                Reset Font
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-white/60 flex items-center gap-1"
                        >
                            <span className="text-xs font-bold">Size</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-24 p-2">
                        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                            {['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'].map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`text-left px-2 py-1 text-xs rounded hover:bg-white/10 ${editor.isActive('textStyle', { fontSize: size }) ? 'bg-white/20' : ''}`}
                                    onClick={() => editor.chain().focus().setFontSize(size).run()}
                                >
                                    {size}
                                </button>
                            ))}
                            <button
                                type="button"
                                className="text-left px-2 py-1 text-xs rounded hover:bg-white/10 text-white/60"
                                onClick={() => editor.chain().focus().unsetFontSize().run()}
                            >
                                Reset
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={addImage}
                        className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
                        title="Upload Image"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/60 pointer-events-none"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </div>
                <Popover open={isVideoPopoverOpen} onOpenChange={setIsVideoPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`h-8 w-8 p-0 ${editor.isActive('video') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                        >
                            <VideoIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" sideOffset={6}>
                        <form onSubmit={submitVideo} className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-white/70">Video URL</label>
                            <input
                                type="url"
                                placeholder="YouTube or direct link"
                                className="flex h-8 w-full rounded-md border border-white/20 bg-black/20 px-3 py-1 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/50"
                                value={videoUrlInput}
                                onChange={(e) => setVideoUrlInput(e.target.value)}
                                autoFocus
                            />
                            <Button type="submit" size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white h-8 mt-1">
                                Add Video
                            </Button>
                        </form>
                    </PopoverContent>
                </Popover>
                <TablePickerPopover editor={editor} />
            </div>

            {(editor.isActive('image') || editor.isActive('video')) && (
                <>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { align: 'left' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 w-8 p-0 ${(editor.getAttributes('image').align === 'left' || editor.getAttributes('video').align === 'left') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                            title="Align Left"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { align: 'center' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 w-8 p-0 ${(editor.getAttributes('image').align === 'center' || editor.getAttributes('video').align === 'center') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                            title="Align Center"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { align: 'right' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 w-8 p-0 ${(editor.getAttributes('image').align === 'right' || editor.getAttributes('video').align === 'right') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                            title="Align Right"
                        >
                            <AlignRight className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { align: 'none' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 px-1 text-xs ${(editor.getAttributes('image').align === 'none' || editor.getAttributes('video').align === 'none' || (!editor.getAttributes('image').align && !editor.getAttributes('video').align)) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                            title="No Alignment / Reset"
                        >
                            None
                        </Button>

                        <Separator orientation="vertical" className="h-4 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { width: '25%' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 px-1 text-xs ${(editor.getAttributes('image').width === '25%' || editor.getAttributes('video').width === '25%') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                        >
                            25%
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { width: '50%' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 px-1 text-xs ${(editor.getAttributes('image').width === '50%' || editor.getAttributes('video').width === '50%') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                        >
                            50%
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                editor.chain().focus().updateAttributes(type, { width: '100%' }).setNodeSelection(from).run()
                            }}
                            className={`h-8 px-1 text-xs ${(editor.getAttributes('image').width === '100%' || editor.getAttributes('video').width === '100%') ? 'bg-white/20 text-white' : 'text-white/60'}`}
                        >
                            100%
                        </Button>

                        <Separator orientation="vertical" className="h-4 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const { from } = editor.state.selection
                                const type = editor.isActive('image') ? 'image' : 'video'
                                const isWrapped = editor.getAttributes(type).wrap
                                editor.chain().focus().updateAttributes(type, { wrap: !isWrapped }).setNodeSelection(from).run()
                            }}
                            className={`h-8 px-2 text-xs font-medium ${(editor.getAttributes('image').wrap || editor.getAttributes('video').wrap) ? 'bg-white/20 text-white' : 'text-white/60'}`}
                            title="Let text wrap around content"
                        >
                            Wrap Text
                        </Button>
                    </div>
                </>
            )}

            <div className="flex-1" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0 text-white/60 disabled:opacity-30"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0 text-white/60 disabled:opacity-30"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            TextStyle,
            FontFamily,
            FontSize,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        width: {
                            default: '100%',
                            parseHTML: element => element.style.width || '100%',
                            renderHTML: attributes => ({
                                style: `width: ${attributes.width}`,
                            }),
                        },
                        align: {
                            default: 'center',
                            parseHTML: element => {
                                const float = element.style.float || element.style.cssFloat;
                                const ml = element.style.marginLeft;
                                const mr = element.style.marginRight;
                                if (float === 'left') return 'left';
                                if (float === 'right') return 'right';
                                if (mr === 'auto' && (ml === '0px' || ml === '0' || !ml)) return 'left';
                                if (ml === 'auto' && (mr === '0px' || mr === '0' || !mr)) return 'right';
                                return 'center';
                            },
                            renderHTML: attributes => {
                                if (attributes.align === 'left') {
                                    return {
                                        style: attributes.wrap
                                            ? 'float: left; margin-right: 1.5rem; margin-bottom: 0.5rem; clear: none;'
                                            : 'margin-right: auto; margin-left: 0; display: block; float: none; clear: both;'
                                    }
                                }
                                if (attributes.align === 'right') {
                                    return {
                                        style: attributes.wrap
                                            ? 'float: right; margin-left: 1.5rem; margin-bottom: 0.5rem; clear: none;'
                                            : 'margin-left: auto; margin-right: 0; display: block; float: none; clear: both;'
                                    }
                                }
                                return { style: 'margin-left: auto; margin-right: auto; display: block; float: none; clear: both;' }
                            },
                        },
                        wrap: {
                            default: false,
                            parseHTML: element => element.getAttribute('data-wrap') === 'true',
                            renderHTML: attributes => ({
                                'data-wrap': attributes.wrap,
                            }),
                        },
                    }
                },
            }).configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
            Image.extend({
                name: 'video',
                addAttributes() {
                    return {
                        src: {
                            default: null,
                            parseHTML: element => element.getAttribute('data-video-url'),
                        },
                        thumbnail: {
                            default: null,
                            parseHTML: element => element.getAttribute('data-thumbnail'),
                            renderHTML: attributes => ({
                                'data-thumbnail': attributes.thumbnail,
                            }),
                        },
                        width: {
                            default: '100%',
                            parseHTML: element => element.style.width || '100%',
                            renderHTML: attributes => ({
                                style: `width: ${attributes.width}`,
                            }),
                        },
                        align: {
                            default: 'center',
                            parseHTML: element => {
                                const float = element.style.float || element.style.cssFloat;
                                const ml = element.style.marginLeft;
                                const mr = element.style.marginRight;
                                if (float === 'left') return 'left';
                                if (float === 'right') return 'right';
                                if (mr === 'auto' && (ml === '0px' || ml === '0' || !ml)) return 'left';
                                if (ml === 'auto' && (mr === '0px' || mr === '0' || !mr)) return 'right';
                                return 'center';
                            },
                            renderHTML: attributes => {
                                if (attributes.align === 'left') {
                                    return {
                                        style: attributes.wrap
                                            ? 'float: left; margin-right: 1.5rem; margin-bottom: 0.5rem; clear: none;'
                                            : 'margin-right: auto; margin-left: 0; display: block; float: none; clear: both;'
                                    }
                                }
                                if (attributes.align === 'right') {
                                    return {
                                        style: attributes.wrap
                                            ? 'float: right; margin-left: 1.5rem; margin-bottom: 0.5rem; clear: none;'
                                            : 'margin-left: auto; margin-right: 0; display: block; float: none; clear: both;'
                                    }
                                }
                                return { style: 'margin-left: auto; margin-right: auto; display: block; float: none; clear: both;' }
                            },
                        },
                        wrap: {
                            default: false,
                            parseHTML: element => element.getAttribute('data-wrap') === 'true',
                            renderHTML: attributes => ({
                                'data-wrap': attributes.wrap,
                                'data-video': 'true',
                                'data-video-url': attributes.src,
                            }),
                        },
                    }
                },
                parseHTML() {
                    return [
                        {
                            tag: 'div[data-video]',
                        },
                    ]
                },
                renderHTML({ HTMLAttributes }) {
                    const { 'data-thumbnail': thumbnail, ...rest } = HTMLAttributes
                    const style = thumbnail
                        ? `background-image: url('${thumbnail}'); background-size: cover; background-position: center; ${rest.style || ''}`
                        : rest.style || ''
                    return ['div', { ...rest, 'data-thumbnail': thumbnail, style }, ['div', { class: 'video-play-button' }, '']]
                },
                // @ts-ignore - Custom command not in RawCommands
                addCommands() {
                    return {
                        // @ts-ignore
                        setVideo: (options: { src: string }) => ({ chain }: any) => {
                            return chain().insertContent({ type: this.name, attrs: options }).run()
                        },
                    } as any
                },
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[800px] text-white p-8 md:p-12 lg:p-16 max-w-[850px] bg-black/20 rounded-lg shadow-inner my-4 clearfix',
            },
        },
    })

    // Update content if it changes externally (e.g. when loading a post)
    // But only if it's different from the current editor content to avoid loops
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return (
        <div className="w-full border border-white/20 rounded-md bg-white/5">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: '${placeholder || "Write your content here..."}';
          float: left;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          height: 0;
        }
        .tiptap {
          outline: none !important;
        }
        .tiptap h1 { font-size: 2rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 1rem; color: white; }
        .tiptap h2 { font-size: 1.5rem; font-weight: bold; margin-top: 1.25rem; margin-bottom: 0.75rem; color: white; }
        .tiptap h3 { font-size: 1.25rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; color: white; }
        .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: white; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: white; }
        .tiptap li { color: white; }
        .tiptap p { color: white; }
        .tiptap a { color: #60a5fa; text-decoration: underline; cursor: pointer; }
        .tiptap img { max-width: 100%; height: auto; border-radius: 0.5rem; transition: outline 0.2s ease; }
        .tiptap img.ProseMirror-selectednode {
          outline: 3px solid #60a5fa;
          outline-offset: 2px;
        }
        .tiptap div[data-video] {
          aspect-ratio: 16/9;
          background: #1e293b;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #475569;
          margin-top: 1rem;
          margin-bottom: 1rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .tiptap div[data-video]::before {
          content: 'Video Content';
          color: #94a3b8;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .tiptap div[data-video].ProseMirror-selectednode {
          outline: 3px solid #60a5fa;
          outline-offset: 2px;
        }
        .tiptap .video-play-button {
          width: 48px;
          height: 48px;
          background: rgba(96, 165, 250, 0.2);
          border: 2px solid #60a5fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .tiptap .video-play-button::after {
          content: '';
          width: 0;
          height: 0;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 12px solid #60a5fa;
          margin-left: 4px;
        }
        .tiptap table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          table-layout: fixed;
          overflow: hidden;
        }
        .tiptap table td,
        .tiptap table th {
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.5rem 0.75rem;
          vertical-align: top;
          min-width: 60px;
          color: white;
          position: relative;
        }
        .tiptap table th {
          background: rgba(255,255,255,0.08);
          font-weight: 600;
          text-align: left;
        }
        .tiptap table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: '';
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(96, 165, 250, 0.15);
          pointer-events: none;
        }
        .tiptap table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #60a5fa;
          cursor: col-resize;
          pointer-events: all;
        }
        .tiptap .tableWrapper {
          overflow-x: auto;
          margin: 1rem 0;
        }
        .tiptap .resize-cursor {
          cursor: col-resize;
        }
      `}</style>
        </div>
    )
}
