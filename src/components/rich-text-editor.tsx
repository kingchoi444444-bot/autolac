"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extension-placeholder";

const FONT_SIZES = [
  { label: "작게", value: "12px" },
  { label: "보통", value: "14px" },
  { label: "크게", value: "18px" },
  { label: "아주 크게", value: "24px" },
];

const COLORS = ["#000000", "#e11d48", "#2563eb", "#16a34a", "#ca8a04"];

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "업로드에 실패했습니다.");
  return data.url as string;
}

const btnClass =
  "rounded px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10 data-[active=true]:bg-black/10 dark:data-[active=true]:bg-white/20";

// Toolbar buttons must not steal focus from the editor on mousedown —
// otherwise the ProseMirror selection collapses before the click's
// command runs, and typed text lands in the wrong place.
const preventFocusLoss = (e: React.MouseEvent) => e.preventDefault();

type ToolbarButtonProps = {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
};

function ToolbarButton({ active, onClick, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      data-active={active}
      onMouseDown={preventFocusLoss}
      onClick={onClick}
      className={btnClass}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-black/10 p-2 dark:border-white/10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <select
        onMouseDown={preventFocusLoss}
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        defaultValue="14px"
        className="rounded border border-black/20 bg-transparent px-2 py-1 text-sm dark:border-white/20"
      >
        {FONT_SIZES.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <s>S</s>
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          title={color}
          onMouseDown={preventFocusLoss}
          onClick={() => editor.chain().focus().setColor(color).run()}
          className="h-5 w-5 rounded-full border border-black/20 dark:border-white/20"
          style={{ backgroundColor: color }}
        />
      ))}

      <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <ToolbarButton
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        왼쪽
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        가운데
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        오른쪽
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        목록
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        번호목록
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <ToolbarButton
        onClick={() => {
          const url = window.prompt("링크 주소를 입력하세요");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        링크
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()}>링크제거</ToolbarButton>
      <ToolbarButton onClick={() => fileInputRef.current?.click()}>
        {uploading ? "업로드 중…" : "이미지"}
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>구분선</ToolbarButton>

      <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>되돌리기</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>다시실행</ToolbarButton>
    </div>
  );
}

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rulesTitle?: string;
  rules?: string[];
};

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "내용을 입력하세요",
  rulesTitle = "글 작성 규칙",
  rules,
}: RichTextEditorProps) {
  const [tab, setTab] = useState<"editor" | "html" | "preview">("editor");
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[240px] px-3 py-2 focus:outline-none",
      },
      handlePaste: (view, event) => {
        const item = Array.from(event.clipboardData?.items ?? []).find((i) =>
          i.type.startsWith("image/"),
        );
        const file = item?.getAsFile();
        if (!file) return false;

        event.preventDefault();
        uploadImageFile(file)
          .then((url) => {
            const node = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(view.state.tr.replaceSelectionWith(node));
          })
          .catch((err) => {
            alert(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
          });
        return true;
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && html !== editor.getHTML()) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (!editor) return null;

  return (
    <div>
      {rules && rules.length > 0 && (
        <div className="mb-3 rounded-lg border border-black/10 bg-black/[0.02] p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
          <p className="mb-2 font-semibold">{rulesTitle}</p>
          <ol className="grid list-decimal grid-cols-1 gap-1 pl-5 sm:grid-cols-2">
            {rules.map((rule, i) => (
              <li key={i} className="text-black/70 dark:text-white/70">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="rounded border border-black/20 dark:border-white/20">
        <div className="flex border-b border-black/10 text-sm dark:border-white/10">
          {(
            [
              ["editor", "에디터"],
              ["html", "HTML편집"],
              ["preview", "미리보기"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 ${
                tab === key
                  ? "border-b-2 border-black font-medium dark:border-white"
                  : "text-black/50 dark:text-white/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "editor" && (
          <div>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        )}

        {tab === "html" && (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 font-mono text-xs focus:outline-none"
          />
        )}

        {tab === "preview" && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none px-3 py-2"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      <input type="hidden" name={name} value={html} />
    </div>
  );
}
