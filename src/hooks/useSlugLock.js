import {getConfiguration} from "../lib/configuration";
import {useState, useEffect} from "react";
import {getAuthUser} from "../lib/auth";

export default function useSlugLock({ collection, slug }) {
  const [slugLocks, setSlugLocks] = useState({});
  const firebase = getConfiguration().firebase;

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection(collection).doc("slugLocks").onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        setSlugLocks(data);
      } else {
        firebase.firestore().collection(collection).doc("slugLocks").set({ [slug]: null });
      }
    });

    return () => unsubscribe();
  }, []);

  function lockSlug() {
    const email = getAuthUser()?.email;
    const lock = {
      email,
      lockedAt: new Date()
    };
    if (!slugLocks[slug]) {
      firebase.firestore().collection(collection).doc("slugLocks").update({ [slug]: lock });
    }
    return lock;
  }

  function releaseLock() {
    const email = getAuthUser().email;
    if (slugLocks[slug]?.email === email) {
      firebase.firestore().collection(collection).doc("slugLocks").update({
        [slug]: null
      })
    }
  }

  return [slugLocks[slug], lockSlug, releaseLock];
}
