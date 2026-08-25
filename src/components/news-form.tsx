"use client";

import { RichTextEditor } from "./rich-text-editor";

const NEWS_RULES = [
  "공식 발표되지 않은 추측성 정보는 '루머'임을 명시해주세요.",
  "제조사/언론사 저작물(사진·기사 원문)을 무단으로 게재하지 마세요.",
  "가격/스펙은 확인된 최신 정보를 기준으로 작성해주세요.",
];

type NewsFormProps = {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    brand?: string;
    model?: string;
    summary?: string;
    price?: string | null;
    imageUrl?: string | null;
    releaseDate?: Date | null;
  };
};

const inputClass = "rounded border border-black/20 px-3 py-2 dark:border-white/20";

export function NewsForm({ action, submitLabel, defaultValues }: NewsFormProps) {
  const releaseDateValue = defaultValues?.releaseDate
    ? defaultValues.releaseDate.toISOString().slice(0, 10)
    : undefined;

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="brand"
          placeholder="브랜드 (예: 현대)"
          defaultValue={defaultValues?.brand}
          required
          className={inputClass}
        />
        <input
          type="text"
          name="model"
          placeholder="모델명 (예: 아반떼)"
          defaultValue={defaultValues?.model}
          required
          className={inputClass}
        />
      </div>

      <input
        type="text"
        name="title"
        placeholder="제목"
        defaultValue={defaultValues?.title}
        required
        className={inputClass}
      />

      <RichTextEditor
        name="summary"
        defaultValue={defaultValues?.summary}
        placeholder="소개/스펙 요약을 입력하세요"
        rulesTitle="신차정보 작성 규칙"
        rules={NEWS_RULES}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="price"
          placeholder="가격 (예: 2,000만원대~)"
          defaultValue={defaultValues?.price ?? ""}
          className={inputClass}
        />
        <input
          type="date"
          name="releaseDate"
          defaultValue={releaseDateValue}
          className={inputClass}
        />
      </div>

      <input
        type="text"
        name="imageUrl"
        placeholder="대표 이미지 URL"
        defaultValue={defaultValues?.imageUrl ?? ""}
        className={inputClass}
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
