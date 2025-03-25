import { create } from 'zustand'

interface ScreenshotStore {
    screenshots: string[];
    addNewScreenshot: (newScreenshot: string) => void;
    removeScreenshot: (screenshot: string) => void;
    clearScreenshots: () => void;
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