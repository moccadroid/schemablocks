import TextInputBlockSchema from './components/blocks/textInputBlock/TextInputBlock.schema.json';
import TextInputBlock from "./components/blocks/textInputBlock/TextInputBlock";
import ElementsBlockSchema from './components/blocks/elementsBlock/ElementsBlock.schema.json';
import ElementsBlock from './components/blocks/elementsBlock/ElementsBlock';
import MediaBlockSchema from './components/blocks/mediaBlock/MediaBlock.schema.json';
import MediaBlock from "./components/blocks/mediaBlock/MediaBlock";
import ComplexBlockSchema from "./components/blocks/complexBlock/ComplexBlock.schema.json";
import ComplexBlock from "./components/blocks/complexBlock/ComplexBlock";

export default [
  {
    name: "TextBlock",
    schema: TextInputBlockSchema,
    block: TextInputBlock,
  },
  {
    name: "ElementsBlock",
    schema: ElementsBlockSchema,
    block: ElementsBlock
  },
  {
    name: "MediaBlock",
    schema: MediaBlockSchema,
    block: MediaBlock
  },
  {
    name: "ComplexBlock",
    schema: ComplexBlockSchema,
    block: ComplexBlock
  }
]
