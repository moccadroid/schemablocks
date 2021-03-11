import LanguageWrapper from "./LanguageWrapper";
import React, {createRef, useRef, useEffect, useState} from "react";
import {Box, Grid, Paper, Typography} from "@material-ui/core";
import useSchemaBlocksData from "../hooks/useSchemaBlocksData";
import useSchemas from "../hooks/useSchemas";

export default function Slug({ slug, onInViewport }) {

  const [schemas] = useSchemas(slug.schemas);
  const [slugData, saveSlugData, deleteSlugData] = useSchemaBlocksData({ collection: slug.collection, slug: slug.slug });
  const boxRef = useRef();

  const languages = [
    { name: "Deutsch", value: "de", ref: createRef() },
    { name: "English", value: "en", ref: createRef() }
  ];

  useEffect(() => {
    handleScroll(true);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  function handleScroll(first = false) {
    const props = {
      name: slug.name,
      onSave: handleSave,
      onPreview: handlePreview,
      onDelete: handleDelete
    }
    const boxRect = boxRef.current.getBoundingClientRect();
    if (first && boxRect.top - 200 < 0) {
      onInViewport(props);
    } else if (boxRect.top - 200 < 0 && boxRect.top + boxRect.height > 0) {
      onInViewport(props);
    }
  }

  function handleSave() {
    if (!languages.every(lang => lang.ref.current.isValid())) {
      return;
    }

    const data = languages.map(language => {
      return {
        lang: language.value,
        blocks: language.ref.current.getData()
      }
    });
    saveSlugData(data);
    console.log(slug.name, "saved", data);
  }

  function handlePreview() {
    /*
    const data = languages.map(language => {
      return {
        language: language.value,
        blocks: language.ref.current.getData()
      }
    });
    */
    console.log(slug.name, "preview missing still");
  }

  function handleDelete() {
    deleteSlugData(slugData);
  }

  return (
    <Box ref={boxRef} mt={10}>
      <Paper variant={"outlined"}>
        <Box p={2}>
          <Typography variant={"h6"}>{slug.name}</Typography>
        </Box>
        <LanguageWrapper
          languages={languages}
          data={slugData}
          schemas={schemas}
        />
      </Paper>
    </Box>
  )

}
