import { createStoreon } from 'storeon'
import { useStoreon } from 'storeon/react'
import { gallery, GalleryState, GalleryEvents } from './gallery'

export const store = createStoreon<GalleryState, GalleryEvents>([gallery])

type StoreData = useStoreon.StoreData<GalleryState, GalleryEvents>

// Set up a custom useStoreon to have our own states types
export const useStore = (store: keyof GalleryState): StoreData => useStoreon<GalleryState, GalleryEvents>(store)
