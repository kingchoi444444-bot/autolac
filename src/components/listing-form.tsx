"use client";

type ListingFormProps = {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    location?: string | null;
    carModel?: string | null;
    carYear?: number | null;
    mileage?: number | null;
    images?: string[];
  };
};

const inputClass =
  "rounded border border-black/20 px-3 py-2 dark:border-white/20";

export function ListingForm({ action, submitLabel, defaultValues }: ListingFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <select
        name="category"
        defaultValue={defaultValues?.category ?? "USED_CAR"}
        required
        className={inputClass}
      >
        <option value="USED_CAR">중고차</option>
        <option value="PART">부품</option>
      </select>

      <input
        type="text"
        name="title"
        placeholder="제목"
        defaultValue={defaultValues?.title}
        required
        className={inputClass}
      />

      <textarea
        name="description"
        placeholder="상세 설명"
        defaultValue={defaultValues?.description}
        required
        rows={8}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="price"
          placeholder="가격 (원)"
          defaultValue={defaultValues?.price}
          required
          min={0}
          className={inputClass}
        />
        <input
          type="text"
          name="location"
          placeholder="지역 (예: 서울 강남구)"
          defaultValue={defaultValues?.location ?? ""}
          className={inputClass}
        />
        <input
          type="text"
          name="carModel"
          placeholder="차종/모델 (예: 아반떼 CN7)"
          defaultValue={defaultValues?.carModel ?? ""}
          className={inputClass}
        />
        <input
          type="number"
          name="carYear"
          placeholder="연식 (예: 2021)"
          defaultValue={defaultValues?.carYear ?? undefined}
          className={inputClass}
        />
        <input
          type="number"
          name="mileage"
          placeholder="주행거리 (km)"
          defaultValue={defaultValues?.mileage ?? undefined}
          min={0}
          className={inputClass}
        />
      </div>

      <textarea
        name="images"
        placeholder="이미지 URL (줄바꿈 또는 쉼표로 구분해 여러 장 입력 가능)"
        defaultValue={defaultValues?.images?.join("\n")}
        rows={3}
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
