"use client";

import { useRouter, useSearchParams } from "next/navigation";

type SortOption = "best_match" | "a_z" | "featured" | "verified";

interface SortSelectorProps {
  currentSort: SortOption;
}

export default function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "best_match", label: "Best Match" },
    { value: "a_z", label: "A-Z" },
    { value: "featured", label: "Featured First" },
    { value: "verified", label: "Verified First" },
  ];

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSort === "best_match") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    params.delete("page"); // Reset to page 1 on sort change

    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="rounded-lg border border-gray-300 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
