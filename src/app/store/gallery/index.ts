import { StoreonModule } from 'storeon'

export interface ImageDefintion {
  thumb: string
  painting: string
}

export interface Painting {
  id: string
  images: ImageDefintion[]
  authors: string[]
  links: string[]
}

export interface GalleryState {
  gallery: {
    loaded: boolean
    paintings: Painting[]
  }
}

export interface GalleryEvents {
  'gallery/fetch': undefined
  'gallery/setPaintings': Painting[]
}

export const gallery: StoreonModule<GalleryState, GalleryEvents> = store => {
  store.on('@init', () => {
    return {
      gallery: {
        loaded: false,
        paintings: []
      }
    }
  })

  store.on('gallery/setPaintings', (_, paintings) => {
    const gallery = {
      loaded: true,
      paintings
    }

    return { gallery }
  })

  store.on('gallery/fetch', async ({ gallery }): Promise<any> => {
    if (gallery.loaded) return {}

    const json = await import('./gallery.json')

    store.dispatch('gallery/setPaintings', json.paintings)
  })
}
