import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ScreenshotStore {
    screenshots: string[];
    addNewScreenshot: (newScreenshot: string) => void;
    removeScreenshot: (screenshot: string) => void;
    clearScreenshots: () => void;
}

interface VideoStore {
    videos: string[];
    addVideo: (newVideo: string) => void;
    removeVideo: (videoUrl: string) => void;
    clearVideos: () => void;
}

export const useScreenshotStore = create<ScreenshotStore>()(
    persist(
        (set) => ({
            screenshots: [],
            addNewScreenshot: (newScreenshot: string) => set((state) => ({
                screenshots: [...state.screenshots, newScreenshot]
            })),
            removeScreenshot: (screenshot: string) => set((state) => ({
                screenshots: state.screenshots.filter((s) => s !== screenshot),
            })),
            clearScreenshots: () => set({ screenshots: [] })
        }),
        {
            name: 'screenshot-storage',
        }
    )
)

export const useVideoStore = create<VideoStore>()(
    persist(
        (set) => ({
            videos: [],
            addVideo: (newVideo: string) => set((state) => ({ videos: [...state.videos, newVideo] })),
            removeVideo: (videoUrl: string) =>
                set((state) => ({
                    videos: state.videos.filter((url) => url !== videoUrl),
                })),
            clearVideos: () => set({ videos: [] }),
        }),
        {
            name: 'video-storage',
        }
    )
)