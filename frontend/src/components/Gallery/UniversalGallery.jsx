import React from 'react';
import GalleryImage from '../GalleryImage';
import GalleryPlaceholder from '../TemplateStructure/GalleryPlaceholder';

const UniversalGallery = ({
    images = [],
    title = 'Gallery',
    baseArtistFolder = null,
    imagesPerRow = 5,
    showNumbers = true
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const open = (index = 0) => {
        setSelectedIndex(index);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);
    const next = () => setSelectedIndex((prev) => (prev + 1) % images.length);
    const prev = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

    // Try to derive artist folder from images if not provided
    const derivedArtistFolder = React.useMemo(() => {
        if (baseArtistFolder) return baseArtistFolder;
        const list = Array.isArray(images) ? images : [];
        for (const p of list) {
            if (typeof p === 'string' && p.includes('/artists/')) {
                const match = p.match(/\/artists\/([^/]+)/);
                if (match && match[1]) return match[1];
            }
        }
        return null;
    }, [baseArtistFolder, images]);

    const rows = React.useMemo(() => {
        const list = Array.isArray(images) ? images : [];
        const rowCount = Math.ceil(list.length / imagesPerRow) || 1;
        return Array.from({ length: rowCount }, (_, rowIdx) =>
            list.slice(rowIdx * imagesPerRow, (rowIdx + 1) * imagesPerRow)
        );
    }, [images, imagesPerRow]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    {title}
                </h2>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {Array.isArray(images) ? images.length : 0} photos
                </span>
            </div>

            <div className="space-y-4">
                {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-5 gap-3 h-32">
                        {row.map((img, idx) => {
                            const actualIndex = rowIdx * imagesPerRow + idx;
                            return (
                                <GalleryImage
                                    key={actualIndex}
                                    image={img}
                                    index={actualIndex}
                                    alt={`Gallery image ${actualIndex + 1}`}
                                    onClick={() => open(actualIndex)}
                                    size="small"
                                    aspectRatio="square"
                                    showNumber={showNumbers}
                                    showHoverIcon={true}
                                    baseArtistFolder={derivedArtistFolder}
                                    className="h-full w-full object-cover"
                                />
                            );
                        })}
                        {Array.from({ length: Math.max(0, imagesPerRow - row.length) }).map((_, emptyIdx) => (
                            <GalleryPlaceholder key={`empty-${rowIdx}-${emptyIdx}`} size="full" className="h-full w-full" />
                        ))}
                    </div>
                ))}
            </div>

            {isOpen && images.length > 0 && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={close}
                            className="absolute top-4 right-4 z-60 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                            ✕
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        <div className="relative">
                            <img
                                src={(() => {
                                    const current = images[selectedIndex] || '';
                                    if (!current) return '';
                                    if (current.startsWith('http')) return `${current}?t=${Date.now()}`;
                                    let p = String(current).trim().replace(/\\/g, '/');
                                    p = p.replace(/^\.\.\/frontend\/public\/?/i, '/');
                                    if (!p.startsWith('/')) p = `/${p}`;
                                    if (baseArtistFolder) {
                                        p = p.replace('/artists/events/events/', `/artists/${baseArtistFolder}/events/`);
                                        p = p.replace('/artists/events/', `/artists/${baseArtistFolder}/events/`);
                                    }
                                    return `${window.location.origin}${encodeURI(p)}?t=${Date.now()}`;
                                })()}
                                alt={`Gallery image ${selectedIndex + 1}`}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                            />
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full shadow-lg">
                                <span className="font-medium">{selectedIndex + 1} of {images.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversalGallery;


