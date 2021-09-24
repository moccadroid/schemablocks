import React from "react";
import {getConfiguration} from "../../lib/configuration";

export function ContentBlocks({ blocks = {}, data, Container }) {

  const configuration = getConfiguration();

  function ContentBlock(Component, block, i) {
    if (Container) {
      return (
        <Container key={"block" + i}>
          <Component block={block} />
        </Container>
      )
    }
    return <Component block={block} key={"block" + i}/>
  }

  function resolveBlocks(data) {
    return data?.blocks?.map((block, i) => {
      const component = blocks[block.id];
      if (component) {
        return ContentBlock(component, block, i);
      } else if (configuration.debug) {
        console.log(block.id, "not found");
      }
    });
  }

  return (
    <div>
      {resolveBlocks(data)}
    </div>
  )
}
