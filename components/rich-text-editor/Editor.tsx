"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { ControllerRenderProps } from "react-hook-form";
import Menubar from "./Menubar";

type CourseFormValues = {
  description: string;
};

type RichTextEditorProps = {
  field: ControllerRenderProps<CourseFormValues, "description">;
};

export function RichTextEditor({ field }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl-prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value
      ? JSON.parse(field.value)
      : "<p>What will students learn from this course?</p>",
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
}
