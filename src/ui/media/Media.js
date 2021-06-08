import React, {useState, useRef, useEffect} from 'react';

export function Media({ data,
                        autoplay = false,
                        loop = false,
                        controls = false,
                        controlsList = "",
                        muted = true,
                        preloadMargin = "100%",
                        preload = false,
                        mediaRef }) {

  const sizes = [200, 400, 800, 1200, 1600, 2000];
  const ref = useRef();
  const [media, setMedia] = useState(null);
  const [opacity, setOpacity] = useState(preload ? 1 : 0);

  useEffect(() => {
    if (!preload) {
      const options = {
        root: null,
        rootMargin: preloadMargin,
        threshold: 0
      }
      const observer = new IntersectionObserver(loadMedia, options);
      observer.observe(ref.current);

      return () => {
        if (ref.current) observer.unobserve(ref.current);
      }
    } else {
      setMedia(resolveMedia(data));
    }

  }, [ref]);

  function onLoad() {
    setOpacity(1);
  }

  function loadMedia(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setMedia(resolveMedia(data));
    }
  }

  function getImageWidth() {
    if (ref.current) {
      const width = ref.current.getBoundingClientRect().width;
      for(let i = 0; i < sizes.length; i++) {
        if (width < sizes[i]) {
          return sizes[i];
        }
      }
    }
    return sizes[sizes.length - 1];
  }

  function createImageSrcSet(id, width, extension, filename, url) {
    const srcSet = [];
    sizes.forEach((size, index) => {
      if (size >= width) {
        const x = Math.round(size / width);
        const src = [id, size, extension].join(".");
        srcSet.push(url.replace(filename, src) + (x > 1 ? ` ${x}x` : ""));
      }
    });
    return srcSet.join(", ");
  }

  function handleImageError(event) {
    if (data?.mimeType?.startsWith("image")) {
      setMedia(
        <picture ref={mediaRef}>
          <img style={styles.image} src={data.url} alt={data.alt}/>
        </picture>
      )
    }
  }

  function resolveMedia(data, width = null) {
    if (data?.mimeType?.includes("svg")) {
      return <img style={styles.svg} src={data.url} alt={data.alt} ref={mediaRef}/>
    }
    else if (data?.mimeType?.startsWith('image')) {

      const extension = data.mimeType.split("/").pop();
      const width = width ?? getImageWidth();
      const decoded = decodeURIComponent(data.url);
      const filename = data.title ?? decoded.split('/').pop().split("?")[0];
      const srcSetWebp = createImageSrcSet(data.id, width,"webp", encodeURIComponent(filename), data.url);
      const srcSetStd = createImageSrcSet(data.id, width, extension, encodeURIComponent(filename), data.url);

      return (
        <picture ref={mediaRef}>
          <source srcSet={srcSetWebp} type={'image/webp'} />
          <img style={styles.image} srcSet={srcSetStd} alt={data.alt} onError={handleImageError} onLoad={onLoad}/>
        </picture>
      )
    }
    else if (data?.mimeType?.startsWith("video")) {
      return (
        <video controls={controls}
               controlsList={controlsList}
               style={styles.video}
               autoPlay={autoplay}
               loop={loop}
               ref={mediaRef}
               muted={muted || autoplay}
        >
          <source type={data.mimeType} src={data.url}/>
        </video>
      )
    }
    return false;
  }

  const containerStyle = {
    opacity,
    transition: "opacity 0.2s ease-in"
  }
  return (
    <div ref={ref} style={containerStyle}>
      { media }
    </div>
  )
}

const styles = {
  image: {
    width: "100%",
    objectFit: "cover"
  },
  video: {
    width: "100%",
    objectFit: "contain"
  },
  svg: {
    width: "100%"
  }
}
