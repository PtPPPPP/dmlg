import { useState, useCallback, memo } from 'react';
import type { Athlete, EventCategory } from '../../data';
import { getEventById, EVENT_CATEGORY_TAG_CLASS } from '../../data';

/* ── 变体配置 ── */

type ImageVariant = 'card' | 'hero' | 'avatar' | 'compare';

const VARIANT_CONFIG: Record<
  ImageVariant,
  { containerClass: string; imgClass: string; placeholderClass: string }
> = {
  card: {
    containerClass: 'relative w-full aspect-[4/5] overflow-hidden rounded-t-xl',
    imgClass: 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
    placeholderClass: 'h-full w-full',
  },
  hero: {
    containerClass: 'relative w-full aspect-[16/9] sm:aspect-[5/3] overflow-hidden rounded-2xl',
    imgClass: 'h-full w-full object-cover',
    placeholderClass: 'h-full w-full',
  },
  avatar: {
    containerClass: 'relative overflow-hidden rounded-full',
    imgClass: 'h-full w-full object-cover',
    placeholderClass: 'h-full w-full',
  },
  compare: {
    containerClass: 'relative overflow-hidden rounded-2xl',
    imgClass: 'h-full w-full object-cover',
    placeholderClass: 'h-full w-full',
  },
};

/* ── 类别渐变色 ── */

const CATEGORY_GRADIENT: Record<string, string> = {
  sprints: 'from-track-sprint/40 via-track-sprint/10 to-transparent',
  'middle-distance': 'from-track-distance/40 via-track-distance/10 to-transparent',
  'long-distance': 'from-track-distance/40 via-track-distance/10 to-transparent',
  hurdles: 'from-track-hurdle/40 via-track-hurdle/10 to-transparent',
  jumps: 'from-track-jump/40 via-track-jump/10 to-transparent',
  throws: 'from-track-throw/40 via-track-throw/10 to-transparent',
};

/* ── 占位图 ── */

function PlaceholderImage({
  athlete,
  variant,
  category,
}: {
  athlete: Athlete;
  variant: ImageVariant;
  category: EventCategory;
}) {
  const initials = athlete.name.slice(0, 2);
  const gradient = CATEGORY_GRADIENT[category] ?? CATEGORY_GRADIENT.sprints;

  if (variant === 'avatar' || variant === 'compare') {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand-600/60 to-brand-900/80 ${variant === 'avatar' ? 'rounded-full' : 'rounded-2xl'}`}
      >
        <span className="text-white/80 font-bold" style={{ fontSize: variant === 'avatar' ? '0.875rem' : '1.5rem' }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${gradient} bg-slate-800/50`}>
      {/* 装饰性背景图案 */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
          <span className="text-2xl font-bold text-white/70">{initials}</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white/60">{athlete.name}</p>
          <p className="text-xs text-white/40 mt-0.5">{athlete.country}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium ${EVENT_CATEGORY_TAG_CLASS[category]} opacity-60`}
        >
          {athlete.mainEvent}
        </span>
      </div>
    </div>
  );
}

/* ── 主组件 ── */

interface AthleteImageProps {
  athlete: Athlete;
  variant?: ImageVariant;
  className?: string;
  showCredit?: boolean;
}

function AthleteImage({
  athlete,
  variant = 'card',
  className = '',
  showCredit = false,
}: AthleteImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const config = VARIANT_CONFIG[variant];

  // 获取图片源：优先 image.src，回退 avatar
  const imageData = athlete.image;
  const avatarUrl = athlete.avatar;
  const imageSrc = imageData?.src || avatarUrl || '';
  const imageAlt = imageData?.alt || `${athlete.name} athlete portrait`;
  const hasImage = !!imageSrc && !imgError;

  const mainEvent = getEventById(athlete.mainEvent);
  const category: EventCategory = mainEvent?.category ?? 'sprints';

  const handleError = useCallback(() => {
    setImgError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  return (
    <div className={`${config.containerClass} ${className}`}>
      {hasImage ? (
        <>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`${config.imgClass} ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            loading="lazy"
            decoding="async"
            onError={handleError}
            onLoad={handleLoad}
          />
          {/* 渐变遮罩 (card 和 hero 模式) */}
          {(variant === 'card' || variant === 'hero') && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          )}
        </>
      ) : (
        <PlaceholderImage athlete={athlete} variant={variant} category={category} />
      )}

      {/* 图片加载中状态 */}
      {hasImage && !imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        </div>
      )}

      {/* credit 信息 (仅 hero 模式显示) */}
      {showCredit && variant === 'hero' && imageData && imageData.usageStatus !== 'placeholder' && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className="rounded bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/50">
            {imageData.credit ? `📷 ${imageData.credit}` : '📷 来源待核验'}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AthleteImage);
