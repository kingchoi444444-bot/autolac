"use client";

import { RichTextEditor } from "./rich-text-editor";

type PostFormProps = {
  action: (formData: FormData) => void;
  defaultTitle?: string;
  defaultContent?: string;
  submitLabel: string;
};

const BOARD_RULES = [
  "제목에 특수문자 사용을 자제해주세요.",
  "욕설, 비방, 특정 회원에 대한 인신공격은 금지됩니다.",
  "타인의 저작물(사진·글)을 무단으로 게재하지 마세요.",
  "광고성 게시글 및 불법 정보 유통은 금지되며, 발견 시 삭제될 수 있습니다.",
];

export function PostForm({ action, defaultTitle, defaultContent, submitLabel }: PostFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <input
        type="text"
        name="title"
        placeholder="제목"
        defaultValue={defaultTitle}
        required
        className="rounded border border-black/20 px-3 py-2 dark:border-white/20"
      />
      <RichTextEditor
        name="content"
        defaultValue={defaultContent}
        placeholder="내용을 입력하세요"
        rules={BOARD_RULES}
      />
      <button
        type="submit"
        className="self-start rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        {submitLabel}
      </button>
    </form>
  );
}
