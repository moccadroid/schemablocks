import {getFirebase} from "../lib/firebaseConfig";
import {useState, useEffect} from "react";
import {getAuthUser} from "../lib/auth";

export default function useSlugLock({ collection, slug }) {
  const [slugLocks, setSlugLocks] = useState({});

  useEffect(() => {
    const unsubscribe = getFirebase().firestore().collection(collection).doc("slugLocks").onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        setSlugLocks(data);
      } else {
        getFirebase().firestore().collection(collection).doc("slugLocks").set({ [slug]: null });
      }
    });

    return () => unsubscribe();
  }, []);

  function lockSlug() {
    const email = getAuthUser().email;
    if (!slugLocks[slug]) {
      getFirebase().firestore().collection(collection).doc("slugLocks").update({
        [slug]: {
          email,
          lockedAt: new Date()
        }
      });
    }
  }

  function releaseLock() {
    const email = getAuthUser().email;
    if (slugLocks[slug]?.email === email) {
      getFirebase().firestore().collection(collection).doc("slugLocks").update({
        [slug]: null
      })
    }
  }

  return [slugLocks[slug], lockSlug, releaseLock];
}