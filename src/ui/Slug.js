import LanguageWrapper from "./LanguageWrapper";
import React, {createRef, useState, useImperativeHandle, forwardRef, useEffect} from "react";
import {Alert, Box, Paper, Snackbar, Typography} from "@material-ui/core";
import useSchemaBlocksData from "../hooks/useSchemaBlocksData";
import useSchemas from "../hooks/useSchemas";
import useSlugLock from "../hooks/useSlugLock";
import {getAuthUser} from "../lib/auth";
import usePreviewData from "../hooks/usePreviewData";

function Slug({ slug, onLockChange }, ref) {

  const languages = [
    { name: "Deutsch", value: "de", ref: createRef() },
    { name: "English", value: "en", ref: createRef() }
  ];

  const [schemas] = useSchemas(slug.schemas);
  const [previewData, setPreviewData] = usePreviewData();
  const [slugData, saveSlugData, deleteSlugData] = useSchemaBlocksData(slug, true);
  const [lock, addLock, releaseLock] = useSlugLock(slug);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const myLock = lock && lock.email === getAuthUser()?.email;

  useImperativeHandle(ref, () => ({
    save: handleSave,
    preview: handlePreview,
    delete: handleDelete
  }));

  function collectData() {
    return languages.map(language => {
      return {
        blocks: language.ref.current.getData(),
        lang: language.value,
        slug: slug.slug
      };
    });
  }

  async function handleSave() {
    if (myLock) {

      if (!languages.every(lang => lang.ref.current.isValid())) {
        console.log("validation failed");
        return;
      }

      const data = collectData();
      const errors = await saveSlugData(data);
      if (!errors) {
        setSaveSuccess(true);
        releaseLock();
      } else {
        console.log(errors);
      }
      console.log(slug.name, "saved", data);
    }

  }

  function handlePreview() {
    const data = collectData();
    const preview = data.find(d => d.lang === currentLanguage.value);
    setPreviewData(slug.slug, preview);
    console.log("previewData set to localStorage", preview);
    const url = window.location.host + "/p/" + slug.slug + "?preview=local";
    window.open(url);
  }

  function handleDelete() {
    deleteSlugData();
  }

  function handleLanguageChange(language) {
    setCurrentLanguage(language);
  }

  return (
    <Box mt={2}>
      <Paper variant={"outlined"}>
        <Box p={2}>
          <Typography variant={"h6"}>{slug.name}</Typography>
        </Box>
        <LanguageWrapper
          languages={languages}
          data={slugData}
          schemas={schemas}
          noEdit={(lock && lock.email !== getAuthUser()?.email) ?? false}
          onChange={handleLanguageChange}
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
    </Box>
  )

}

export default forwardRef(Slug);
