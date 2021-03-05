import styles from './SchemaView.module.scss';
import ReactJson from 'react-json-view'
import {Typography} from "@material-ui/core";

export default function SchemaView({ schema }) {

  const options = {
    displayObjectSize: false,
    displayDataTypes: false,
    enableClipboard: true,
    collapseStringsAfterLength: false,
    collapsed: true
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.schemaView}>
        <div className={styles.header}>
          <Typography variant={"h6"}>This is the schema that created the above:</Typography>
        </div>
        <div className={styles.body}>
          <ReactJson src={schema} {...options}/>
        </div>
      </div>
    </div>
  )
}
