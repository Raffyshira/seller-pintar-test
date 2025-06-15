'use client'
import '@mdxeditor/editor/style.css'

import { BlockTypeSelect, BoldItalicUnderlineToggles, headingsPlugin, listsPlugin, ListsToggle, markdownShortcutPlugin, MDXEditor, toolbarPlugin, UndoRedo } from '@mdxeditor/editor'

type Props = {
    value: string
    onChange: (v: string) => void
}

export default function MDXEditorWrapper({ value, onChange }: Props) {
    return (
        <div className="border rounded-md min-h-[300px]">
            <MDXEditor
                markdown={value}
                onChange={onChange}
                placeholder="Type a content.."
                plugins={[
                    listsPlugin(),
                    headingsPlugin(),
                    markdownShortcutPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <BlockTypeSelect />
                                <ListsToggle />

                            </>
                        )
                    })]}
            />
        </div>
    )
}
