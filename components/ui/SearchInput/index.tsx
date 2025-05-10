"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

function SearchComponent() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();
    // alert(`Searching for: ${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative mx-auto w-full max-w-lg">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search for..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm shadow-sm focus:border-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {/* Search Icon */}
      <Search
        className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-1 text-sm font-semibold text-white transition hover:bg-primary"
      >
        Search
      </button>
    </form>
  );
}

export default SearchComponent;
