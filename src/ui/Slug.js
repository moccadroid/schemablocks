import LanguageWrapper from "./LanguageWrapper";
import React, {createRef, useState, useImperativeHandle, forwardRef, useEffect} from "react";
import {
  Alert,
  Box, Button,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import useSchemaBlocksData from "../hooks/useSchemaBlocksData";
import useSchemas from "../hooks/useSchemas";
import useSlugLock from "../hooks/useSlugLock";
import {getAuthUser} from "../lib/auth";
import usePreviewData from "../hooks/usePreviewData";
import {getConfiguration} from "../lib/configuration";
import AdapterDateFns from '@material-ui/lab/AdapterDayjs';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import dayjs from "dayjs";
import InputDialog from "./alerts/InputDialog";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
// import useSlugStore from "../hooks/useSlugStore";

function Slug({ slug, onLockChange }, ref) {

  const configuration = getConfiguration();
  const languages = configuration.languages.map(lang => ({...lang, ref: createRef()}));
  const [schemas] = useSchemas(slug.schemas);
  const [previewData, setPreviewData] = usePreviewData();
  const [slugData, saveSlugData, deleteSlugData] = useSchemaBlocksData(slug, true);
  const [lock, addLock, releaseLock] = useSlugLock(slug);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const [slugName, setSlugName] = useState(slug.name);
  const [showNameChangeDialog, setShowNameChangeDialog] = useState(false);

  const myLock = lock && lock.email === getAuthUser()?.email;

  const [publishAt, setPublishAt] = useState(dayjs());
  const [publish, setPublish] = useState(true);

  useEffect(() => {
    if (slug.publish) {
      let pubDate = slugData[0]?.publishAt;
      if (pubDate) {
        if (typeof pubDate["toDate"] === "function") {
          pubDate = dayjs(pubDate.toDate());
        }
        setPublish(true);
      } else {
        setPublish(false);
      }
      setPublishAt(pubDate || null);
    }
  }, [slugData]);

  useImperativeHandle(ref, () => ({
    save: handleSave,
    preview: handlePreview,
    delete: handleDelete
  }));

  function collectData() {
    let pub = publishAt;
    if (publishAt && typeof publishAt["toDate"] === "function") {
      pub = publishAt.toDate();
    }

    return languages.map(language => {
      return {
        blocks: language.ref.current?.getData() ?? [],
        lang: language.value,
        slug: slug.slug,
        publishAt: pub
      };
    });
  }

  async function handleSave() {
    if (myLock) {

      if (!languages.every(lang => lang.ref.current ? lang.ref.current?.isValid() : true)) {
        console.log("validation failed");
        languages.forEach(lang => console.log(lang));
        return;
      }

      let data = collectData();
      const errors = await saveSlugData(data, slugName);
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

  function handlePublishSwitch(event) {
    const pub = event.target.checked;

    if (!pub) {
      setPublishAt(null);
    } else {
      setPublishAt(dayjs());
    }
    setPublish(pub);
  }

  function changeSlugName(name) {
    if (name && name !== "") {
      setSlugName(name);
    }
    setShowNameChangeDialog(false);
  }

  return (
    <Box mt={2}>
      <Paper variant={"outlined"}>
        <Container>
          <Grid container spacing={2} alignItems="center" mt={1}>
            <Grid item>
              <Typography variant={"h6"}>{slugName}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={() => setShowNameChangeDialog(true)}>
                <EditIcon />
              </IconButton>
            </Grid>
          </Grid>
          {slug.publish &&
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <FormControlLabel label={"Publish"} control={
                  <Switch checked={publish} onChange={handlePublishSwitch}/>
                }/>
              </Grid>
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Publish on"
                    value={publishAt}
                    disabled={!publishAt}
                    onChange={(newValue) => {
                      setPublishAt(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        helperText={null}
                        variant="standard"
                      />
                    )}
                  />
                </LocalizationProvider>
                {/*
                <MuiPickersUtilsProvider utils={DayJsUtils}>
                  <DatePicker value={publishAt} onChange={handlePublishChange} />
                </MuiPickersUtilsProvider>
                */}
              </Grid>
            </Grid>
          }
        </Container>
        <LanguageWrapper
          languages={languages}
          data={slugData}
          schemas={schemas}
          noEdit={(lock && lock.email !== getAuthUser()?.email) ?? false}
          onChange={handleLanguageChange}
        />
        <InputDialog
          open={showNameChangeDialog}
          title={"New Slug Name"}
          errorText={"Be careful, this is still experimental."}
          text={"Please enter the new name of this page"}
          onClose={changeSlugName}
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
