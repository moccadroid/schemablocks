import {ContentBlocks} from "schemablocks/ContentBlocks";
import ComplexBlock from "./components/blocks/complexBlock/ComplexBlock";
import ElementsBlock from "./components/blocks/elementsBlock/ElementsBlock";
import MediaBlock from "./components/blocks/mediaBlock/MediaBlock";
import TextInputBlock from "./components/blocks/textInputBlock/TextInputBlock";
import {useSchemaBlocksData} from "schemablocks";
import React from "react";

export default function Preview() {

  const [data] = useSchemaBlocksData({ collection: "demoBlocks", slug: "demoBlocks1" });

  const blocks = {
    "ComplexBlock": ComplexBlock,
    "ElementsBlock": ElementsBlock,
    "MediaBlock": MediaBlock,
    "TextBlock": TextInputBlock
  }

  const pageData = data.filter(d => d.lang === "de");

  function Container({ children }) {
    return (
      <div style={{ marginBottom: 80, borderBottom: "1px solid #ccc", paddingBottom: 10}} >
        {children}
      </div>
    )
  }

  return (
    <ContentBlocks data={pageData?.[0]} blocks={blocks} Container={Container}/>
  )
}
