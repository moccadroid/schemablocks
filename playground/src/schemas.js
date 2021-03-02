import TextInputBlockSchema from './components/textInputs/TextInputBlock.schema.json';
import TextInputBlock from "./components/textInputs/TextInputBlock";
import ElementsBlockSchema from './components/elementsBlock/ElementsBlock.schema.json';
import ElementsBlock from './components/elementsBlock/ElementsBlock';
import MediaBlockSchema from './components/mediaBlock/MediaBlock.schema.json';
import MediaBlock from "./components/mediaBlock/MediaBlock";
import ComplexBlockSchema from "./components/complexBlock/ComplexBlock.schema.json";
import ComplexBlock from "./components/complexBlock/ComplexBlock";

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