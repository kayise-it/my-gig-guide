import React, { useEffect, useMemo, useRef, useState } from 'react';
import ratingService from '../../services/ratingService';
import { StarIcon } from '@heroicons/react/24/solid';

function StarRow({ value = 0 }) {
  const full = Math.round(Number(value) * 2) / 2;
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i + 1 <= full ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function VenueReviewComments({ venueId, venueName }) {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const hasReviews = reviews && reviews.length > 0;
  const current = hasReviews ? reviews[index % reviews.length] : null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await ratingService.getItemRatings('venue', venueId, 1, 20);
        if (!mounted) return;
        const items = (res?.ratings || []).filter(r => r?.comment || r?.review || r?.title);
        setReviews(items);
      } catch (e) {
        setReviews([]);
      }
    })();
    return () => { mounted = false; };
  }, [venueId]);

  useEffect(() => {
    if (!hasReviews) return;
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [hasReviews, reviews.length]);

  if (!hasReviews) {
    return (
      <div className="bg-white border border-gray-200 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Reviews</h3>
        <p className="text-sm text-gray-500">No reviews yet. Be the first to rate {venueName}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
          <div className="text-xs text-gray-500">{index + 1} / {reviews.length}</div>
        </div>

        <div className="relative">
          <div className="transition-all duration-500">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold">
                {String(current?.user_name || current?.user || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{
                    (() => {
                      if (current?.user_name) return current.user_name;
                      const u = current?.user;
                      if (!u) return 'Anonymous';
                      if (typeof u === 'string') return u;
                      if (typeof u === 'object') return u.username || u.name || 'Anonymous';
                      return String(u);
                    })()
                  }</div>
                  <StarRow value={current?.rating || current?.stars || 0} />
                </div>
                {current?.title && (
                  <div className="mt-1 text-sm font-semibold text-gray-800">{current.title}</div>
                )}
                {(current?.comment || current?.review) && (
                  <p className="mt-2 text-sm text-gray-600 leading-6 line-clamp-4">{current.comment || current.review}</p>
                )}
                {current?.createdAt && (
                  <div className="mt-2 text-xs text-gray-400">{new Date(current.createdAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-purple-600' : 'bg-gray-300'}`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


