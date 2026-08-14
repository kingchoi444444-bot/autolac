"use client";

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

      <textarea
        name="summary"
        placeholder="소개/스펙 요약"
        defaultValue={defaultValues?.summary}
        required
        rows={8}
        className={inputClass}
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
