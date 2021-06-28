import {useEffect, useState} from "react";
import {useSchemaBlocksData} from "schemablocks";
import {Media} from "schemablocks/Media";
import {Button} from "@material-ui/core";

export default function Demo() {
  const [data] = useSchemaBlocksData({ collection: "demoBlocks", slug: "demoBlocks1"});
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    const deBlocks = data.find(d => d.lang === "de");
    const firstMediaBlock = deBlocks?.blocks.find(b => b.id === "MediaBlock");
    if (firstMediaBlock) {
      setImages(firstMediaBlock.data.multipleImages);
      setVideo(firstMediaBlock.data.singleVideo);
    }
  }, [data]);

  function reverse() {
    setImages(images => [...images].reverse());
  }

  console.log("images", images);

  return (
    <div>
      <Button onClick={reverse}>Reverse</Button>
      {images.map((image, i) => {
        return (
          <div style={{ width: 400, height: 300}} key={"image" + image.id}>
            <Media data={image} preload />
          </div>
        )
      })}
      {video && <div>
        <Media data={video} controls controlsList={"nodownload"}/>
      </div>}
    </div>
  )
}
