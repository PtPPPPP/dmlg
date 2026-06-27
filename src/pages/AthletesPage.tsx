import { useState, useMemo } from 'react';
import type { EventCategory } from '../data';
import { athletes, getAllCountries, searchAthletes, getEventsByCategory } from '../data';
import { useFavorites } from '../hooks/useFavorites';
import AthleteGrid from '../components/athletes/AthleteGrid';
import FilterBar from '../components/athletes/FilterBar';
import SearchBox from '../components/athletes/SearchBox';
import { EmptyState } from '../components/ui/EmptyState';

export default function Athletes() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const countries = useMemo(() => getAllCountries(), []);

  const filtered = useMemo(() => {
    let result = [...athletes];

    if (search.trim()) {
      result = searchAthletes(search.trim());
    }

    if (category !== 'all') {
      const categoryEventIds = getEventsByCategory(category).map((e) => e.id);
      result = result.filter((a) =>
        a.events.some((e) => categoryEventIds.includes(e))
      );
    }

    if (country) {
      result = result.filter((a) => a.country === country);
    }

    if (gender !== 'all') {
      result = result.filter((a) => a.gender === gender);
    }

    if (showFavoritesOnly) {
      result = result.filter((a) => favorites.includes(a.id));
    }

    return result;
  }, [search, category, country, gender, showFavoritesOnly, favorites]);

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="py-8">
          <h1 className="text-3xl font-extrabold text-white">运动员图鉴</h1>
          <p className="mt-2 text-slate-400">
            浏览钻石联赛各项目运动员资料，了解他们的技术特点和代表成绩
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <SearchBox value={search} onChange={setSearch} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            selectedCategory={category}
            onCategoryChange={setCategory}
            selectedCountry={country}
            onCountryChange={setCountry}
            selectedGender={gender}
            onGenderChange={setGender}
            countries={countries}
            showFavoritesOnly={showFavoritesOnly}
            onShowFavoritesChange={setShowFavoritesOnly}
          />
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-slate-500">
          共 {filtered.length} 位运动员
          {search && ` — 搜索"${search}"`}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <AthleteGrid
            athletes={filtered}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState
            icon="🔍"
            title="没有找到匹配的运动员"
            description="试试调整筛选条件或搜索关键词"
          />
        )}
      </div>
    </div>
  );
}
