import React, {useRef, useState} from "react";
import {Box} from "@material-ui/core";
import {Media} from "./Media";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';

export default function MediaWrapper({ media }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef();

  function togglePlay() {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  }

  if (media.mimeType.startsWith("video")) {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
    return (
      <Box sx={{ position: "relative"}}>
        <Box onClick={togglePlay}>
          <Media data={media} loop mediaRef={videoRef}/>
        </Box>
        {!playing &&
          <IconButton sx={style} onClick={togglePlay}>
            <PlayCircleFilledWhiteIcon style={{ color: "white"}} fontSize={"large"}/>
          </IconButton>
        }
      </Box>
    )
  }
  return (
    <Media data={media} />
  )
}
