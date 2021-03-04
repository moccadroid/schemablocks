import React from 'react';

export default function Media({ data }) {

  const resolveMedia = (data) => {
    if (data.mimeType.startsWith('image')) {
      const decoded = decodeURIComponent(data.url);
      const filename = decoded.split('/').pop().split('?')[0];
      const extension = filename.split('.').pop();

      const webpSrc = data.url.replace(filename, data.id + '.1600.webp');
      const stdSrc = data.url.replace(filename, data.id + '.200.' + extension);

      // TODO: more magic needed to make images truly responsive... but this is already looking good :)
      return (
        <picture>
          <source srcSet={webpSrc} type={'image/webp'}/>
          <img style={styles.image} src={stdSrc} alt={data.alt} />
        </picture>
      )
    }
  }

  return (
    <div>
      { resolveMedia(data) }
    </div>
  )
}

const styles = {
  image: {
    width: "100%",
    objectFit: "cover"
  }
}