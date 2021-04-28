import create from "zustand";
import {getConfiguration} from "../lib/configuration"

function createDefaultSlug(slugName) {
  const config = getConfiguration();
  return config.languages.map(language => ({
    blocks: [],
    lang: language.value,
    slug: slugName
  }));
}

const defaultStore = {
  slug: [],
  lock: null
}

function initSlugStore(collection, slugName, realtime = false) {
  return create((set, get) => ({
    slug: defaultStore.slug,
    setSlug: slug => {
      const dirty = get().slug !== slug;
      if (dirty) {
        set({slug, dirty});
      } else {
        set({ slug });
      }
    },
    dirty: false,
    lock: defaultStore.lock,
    setLock: lock => set({ lock }),
  }));
}

/*
const useSlugStore =
*/

export default initSlugStore;
