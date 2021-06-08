import {useEffect, useState} from "react";
import {useSchemaBlocksData} from "schemablocks";
import {Media} from "schemablocks/Media";

export default function Demo() {
  const [data] = useSchemaBlocksData({ collection: "demoBlocks", slug: "demoBlocks1"});
  const [images, setImages] = useState([]);

  useEffect(() => {
    const deBlocks = data.find(d => d.lang === "de");
    const firstMediaBlock = deBlocks?.blocks.find(b => b.id === "MediaBlock");
    if (firstMediaBlock) {
      setImages(firstMediaBlock.data.multipleImages);
    }

  }, [data]);

  return (
    <div>
      {images.map(image => {
        return (
          <div style={{ width: 400, height: 300}}>
            <Media data={image} preload />
          </div>
        )
      })}
    </div>
  )
}
