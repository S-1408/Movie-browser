import { IMAGE_BASE_URL, YOUTUBE_EMBED_URL } from "@/utils/urls";

// Image sizes
export const IMAGE_SIZES = {
    poster: "w500",
    posterSmall: "w342",
    backdrop: "w1280",
    profile: "w185",
    original: "original",
} as const;

type ImageSize = (typeof IMAGE_SIZES)[keyof typeof IMAGE_SIZES];

// Image / video URL builders (return null if TMDB has no image)
export const imageUrl = (path: string | null, size: ImageSize = IMAGE_SIZES.poster) =>
    path ? `${IMAGE_BASE_URL}/${size}${path}` : null;

export const youtubeEmbedUrl = (key: string) => `${YOUTUBE_EMBED_URL}/${key}`;
