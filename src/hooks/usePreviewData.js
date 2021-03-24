import React, { useState, useEffect } from 'react';

export default function usePreviewData(data, query) {

  const [previewData, setPreviewData] = useState(data);

  useEffect(() => {
    if (!data || !query) {
      return;
    }

    const { preview } = query;
    if (preview === 'local') {
      const d = localStorage.getItem(data.name);
      if (d) {
        setPreviewData(JSON.parse(d));
        console.log("using preview data", d);
      }
    } else if (preview) {
      setPreviewData(null);
    } else {

    }
  }, [data, query]);

  const setData = (slug, data) => {
    localStorage.setItem(slug, JSON.stringify(data));
    setPreviewData(data);
  }

  return [previewData, setData];
}
