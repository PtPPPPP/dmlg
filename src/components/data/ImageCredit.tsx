import { memo } from 'react';
import type { AthleteImage as AthleteImageType } from '../../data';

interface ImageCreditProps {
  image?: AthleteImageType;
  className?: string;
}

const STATUS_CONFIG = {
  verified: { label: '图片已核验', color: 'text-emerald-400', icon: '✓' },
  pending: { label: '图片待核验', color: 'text-amber-400', icon: '⏳' },
  unavailable: { label: '暂无授权图片', color: 'text-slate-500', icon: '—' },
  placeholder: { label: '', color: '', icon: '' },
} as const;

function ImageCredit({ image, className = '' }: ImageCreditProps) {
  // placeholder 不显示任何信息
  if (!image || image.usageStatus === 'placeholder') {
    return null;
  }

  const status = STATUS_CONFIG[image.usageStatus];

  return (
    <div className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
      <span className={`${status.color} font-medium`}>
        {status.icon} {status.label}
      </span>

      {image.sourceName && (
        <>
          <span className="text-slate-600">·</span>
          {image.sourceUrl ? (
            <a
              href={image.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-brand-400 transition-colors underline decoration-dotted underline-offset-2"
            >
              {image.sourceName}
            </a>
          ) : (
            <span className="text-slate-400">{image.sourceName}</span>
          )}
        </>
      )}

      {image.license && (
        <>
          <span className="text-slate-600">·</span>
          {image.licenseUrl ? (
            <a
              href={image.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-brand-400 transition-colors underline decoration-dotted underline-offset-2"
            >
              {image.license}
            </a>
          ) : (
            <span className="text-slate-400">{image.license}</span>
          )}
        </>
      )}

      {image.credit && !image.sourceName && (
        <>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">📷 {image.credit}</span>
        </>
      )}
    </div>
  );
}

export default memo(ImageCredit);
