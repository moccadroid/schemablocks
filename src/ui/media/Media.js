import React, {useState, useRef, useEffect} from 'react';

export function Media({ data, autoplay = false, loop = false, mediaRef }) {

  const ref = useRef();
  const [media, setMedia] = useState(false);
  const sizes = [200, 400, 800, 1200, 1600];

/*
  useEffect(() => {
    setMedia(resolveMedia(data));
  }, [data])
*/
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

  function resolveMedia(data) {
    if (data?.mimeType?.includes("svg")) {
      return <img style={styles.svg} src={data.url} alt={data.alt} ref={mediaRef}/>
    }
    else if (data?.mimeType?.startsWith('image')) {

      const extension = data.mimeType.split("/").pop();
      const width = getImageWidth();
      const webpSrcFilename = [data.id, width, 'webp'].join('.');
      const stdSrcFilename = [data.id, width, extension].join('.');
      const decoded = decodeURIComponent(data.url);
      const filename = data.title ?? decoded.split('/').pop().split("?")[0];
      const webpSrc = data.url.replace(encodeURIComponent(filename), webpSrcFilename);
      const stdSrc = data.url.replace(encodeURIComponent(filename), stdSrcFilename);

      return (
        <picture ref={mediaRef}>
          <source srcSet={webpSrc} type={'image/webp'}/>
          <img style={styles.image} src={stdSrc} alt={data.alt} />
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
