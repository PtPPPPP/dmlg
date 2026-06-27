import { EVENT_CATEGORY_TAG_CLASS, EVENT_CATEGORY_LABELS, trackEvents } from '../../data';
import type { EventCategory } from '../../data';

interface FilterBarProps {
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedGender: 'all' | 'male' | 'female';
  onGenderChange: (gender: 'all' | 'male' | 'female') => void;
  countries: string[];
  showFavoritesOnly: boolean;
  onShowFavoritesChange: (show: boolean) => void;
}

// 只显示有实际项目的类别
const categoriesWithEvents = new Set(trackEvents.map((e) => e.category));

const CATEGORIES: Array<{ value: EventCategory | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  ...Object.entries(EVENT_CATEGORY_LABELS)
    .filter(([key]) => categoriesWithEvents.has(key as EventCategory))
    .map(([value, label]) => ({
      value: value as EventCategory,
      label,
    })),
];

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
  selectedGender,
  onGenderChange,
  countries,
  showFavoritesOnly,
  onShowFavoritesChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === cat.value
                ? cat.value === 'all'
                  ? 'bg-white text-slate-900'
                  : `${EVENT_CATEGORY_TAG_CLASS[cat.value as EventCategory]} ring-1 ring-current`
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-500/50"
        >
          <option value="">全部国家</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {(['all', 'male', 'female'] as const).map((g) => (
            <button
              key={g}
              onClick={() => onGenderChange(g)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedGender === g
                  ? 'bg-white/15 text-white'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              {g === 'all' ? '全部' : g === 'male' ? '男' : '女'}
            </button>
          ))}
        </div>

        <button
          onClick={() => onShowFavoritesChange(!showFavoritesOnly)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            showFavoritesOnly
              ? 'bg-track-gold/15 text-track-gold border border-track-gold/30'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          <svg className="h-4 w-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          只看收藏
        </button>
      </div>
    </div>
  );
}
