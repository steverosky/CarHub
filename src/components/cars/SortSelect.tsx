import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type SortOption = 'price-low' | 'price-high' | 'rating';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
      >
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <FiChevronDown />
      </div>
    </div>
  );
};

export default SortSelect;