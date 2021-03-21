import React, {useState, useRef, useEffect} from 'react';

export function Media({ data, autoplay = false, loop = false, mediaRef }) {

  const sizes = [200, 400, 800, 1200, 1600];
  const ref = useRef();
  const [media, setMedia] = useState(resolveMedia(data, 200));

  useEffect(() => {
    setMedia(resolveMedia(data));
  }, [data]);

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
    //console.log(event);
    //console.log(getImageWidth());
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
          <img style={styles.image} srcSet={srcSetStd} alt={data.alt} onError={handleImageError}/>
        </picture>
      )
    }
    else if (data?.mimeType?.startsWith("video")) {
      return (
        <video style={styles.video} autoPlay={autoplay} loop={loop} ref={mediaRef}>
          <source type={data.mimeType} src={data.url}/>
        </video>
      )
    }
    return false;
  }

  return (
    <div ref={ref}>
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
