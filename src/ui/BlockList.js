import React, {useState} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SchemaBlock from "./SchemaBlock";

export default function BlockList({ slug, blocks, onRemove, onOrderChange }) {

  const [isExpanded, setIsExpanded] = useState({});

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    let orderedList = Array.from(blocks);
    const [removed] = orderedList.splice(result.source.index, 1);
    orderedList.splice(result.destination.index, 0, removed);
    orderedList.forEach((r, i) => r.index = i);
    orderedList.sort((a,b) => a.index - b.index);
    onOrderChange(orderedList);
  }

  const handleAccordionChange = (id) => (event, expanded) => {
    setIsExpanded(isExpanded => {
      return {
        ...isExpanded,
        [id]: expanded
      }
    })
  }

  return (
    <Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"droppable"}>
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {blocks.map((block, index) => {
                let title = block.schema.name;
                const titleDataField = block.schema.schema.controls?.titleDataField;
                if (titleDataField) {
                  title = block.data[titleDataField] || title;
                }
                return (
                  <Draggable key={block.id} draggableId={block.id} index={index} isDragDisabled={isExpanded[block.id]}>
                    {(provided) => (
                      <Accordion
                        onChange={handleAccordionChange(block.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon/>}
                          aria-controls={block.id}
                          id={block.id}
                        >
                          <Typography variant={"h6"} sx={{width: "100%"}}>{title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{backgroundColor: "#fafafa"}}>
                          <SchemaBlock
                            ref={block.ref}
                            block={block}
                            onRemove={() => onRemove(block.id)}
                          />
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}