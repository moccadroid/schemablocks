import ImageSchemaDefinition from "./Image.schema.definition.json";
import VideoSchemaDefinition from "./Video.schema.definition.json";
import SvgSchemaDefinition from "./Svg.schema.definition.json";
import LinkSchemaDefinition from "./Link.schema.definition.json";

const definitions = {
  "$Image": ImageSchemaDefinition,
  "$Video": VideoSchemaDefinition,
  "$Svg": SvgSchemaDefinition,
  "$Link": LinkSchemaDefinition
}

export default definitions;
