import React, {useState, useRef, useEffect} from 'react';

export default function Media({ data }) {

  const ref = useRef();
  const [media, setMedia] = useState(false);
  const sizes = [200, 400, 800, 1200, 1600];


  useEffect(() => {
    setMedia(resolveMedia(data));
  }, [])

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
    if (data?.mimeType?.startsWith('image')) {
      const width = getImageWidth();
      const decoded = decodeURIComponent(data.url);
      const filename = decoded.split('/').pop().split('?')[0];
      const extension = filename.split('.').pop();

      const webSrcUrl = [data.id, width, 'webp'].join('.');
      const stdSrcUrl = [data.id, width, extension].join('.');

      const webpSrc = data.url.replace(filename, webSrcUrl);
      const stdSrc = data.url.replace(filename, stdSrcUrl);

      return (
        <picture>
          <source srcSet={webpSrc} type={'image/webp'}/>
          <img style={styles.image} src={stdSrc} alt={data.alt} />
        </picture>
      )
    }
    if (data?.mimeType?.startsWith("video")) {
      return (
        <video style={styles.video}>
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
    objectFit: "cover"
  }
}