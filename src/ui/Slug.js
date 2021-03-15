import LanguageWrapper from "./LanguageWrapper";
import React, {createRef, useRef, useEffect, useState} from "react";
import {Alert, Box, Grid, Paper, Snackbar, Typography} from "@material-ui/core";
import useSchemaBlocksData from "../hooks/useSchemaBlocksData";
import useSchemas from "../hooks/useSchemas";
import ConfirmationDialog from "./alerts/ConfirmationDialog";

export default function Slug({ slug, onInViewport }) {

  const [schemas] = useSchemas(slug.schemas);
  const [slugData, saveSlugData, deleteSlugData] = useSchemaBlocksData({ collection: slug.collection, slug: slug.slug });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
      onDelete: slugData.length > 0 ? () => setShowDeleteDialog(true) : null
    }

    const boxRect = boxRef.current.getBoundingClientRect();
    if (first && boxRect.top - 200 < 0) {
      onInViewport(props);
    } else if (boxRect.top - 200 < 0 && boxRect.top + boxRect.height > 0) {
      onInViewport(props);
    }
  }

  async function handleSave() {
    if (!languages.every(lang => lang.ref.current.isValid())) {
      console.log("validation failed");
      return;
    }

    const data = languages.map(language => {
      return {
        lang: language.value,
        blocks: language.ref.current.getData()
      }
    });
    const errors = await saveSlugData(data);
    if (!errors) {
      setSaveSuccess(true);
    } else {
      console.log(errors);
    }
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

  function handleDelete(value) {
    if (value) {
      deleteSlugData();
    }
    setShowDeleteDialog(false);
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
      <Snackbar open={saveSuccess} autoHideDuration={6000} onClose={() => setSaveSuccess(false)}>
        <Alert onClose={() => setSaveSuccess(false)} severity="success" variant="filled">
          Saved successfully
        </Alert>
      </Snackbar>
      <Snackbar open={saveError} autoHideDuration={6000} onClose={() => setSaveError(null)}>
        <Alert onClose={() => setSaveError(false)} severity="error" variant="filled">
          Error saving data.
        </Alert>
      </Snackbar>
      <ConfirmationDialog
        open={showDeleteDialog}
        text={"Do you really want to delete this page? It can't be recovered after that."}
        title={`Delete page ${slug.name}?`}
        onClose={handleDelete} />
    </Box>
  )

}
