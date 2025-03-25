import { create } from 'zustand'

interface ScreenshotStore {
    screenshots: string[];
    addNewScreenshot: (newScreenshot: string) => void;
    removeScreenshot: (screenshot: string) => void;
    clearScreenshots: () => void;
}

interface VideoStore {
    videos: Blob[];
    addVideo: (newVideo: Blob) => void;
    removeVideo: (video: Blob) => void;
    clearVideos: () => void;
}

export const useScreenshotStore = create<ScreenshotStore>((set) => ({
    screenshots: [],
    addNewScreenshot: (newScreenshot: string) => set((state) => ({
        screenshots: [...state.screenshots, newScreenshot]
    })),
    removeScreenshot: (screenshot: string) => set((state) => ({
        screenshots: state.screenshots.filter((s) => s !== screenshot),
    })),
    clearScreenshots: () => set({ screenshots: [] })
}))



export const useVideoStore = create<VideoStore>((set) => ({
    videos: [],
    addVideo: (newVideo) => set((state) => ({ videos: [...state.videos, newVideo] })),
    removeVideo: (videoToRemove) =>
        set((state) => ({
            videos: state.videos.filter((video) => video !== videoToRemove),
        })),
    clearVideos: () => set({ videos: [] }),
}));