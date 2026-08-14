"use client";

type PostFormProps = {
  action: (formData: FormData) => void;
  defaultTitle?: string;
  defaultContent?: string;
  submitLabel: string;
};

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
      <textarea
        name="content"
        placeholder="내용을 입력하세요"
        defaultValue={defaultContent}
        required
        rows={12}
        className="rounded border border-black/20 px-3 py-2 dark:border-white/20"
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
