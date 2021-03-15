import styles from './ComplexBlock.module.scss';
import {Media} from 'schemablocks/Media';
import schema from './ComplexBlock.schema.json';
import SchemaView from "../../ui/SchemaView";
import {Typography} from "@material-ui/core";

function Friend({ data }) {
  return (
    <div className={styles.friend}>
      <Media data={data.image} />
      <div className={styles.name}><Typography variant={"h6"}>{data.name}</Typography></div>
      <div className={styles.age}><Typography variant={"caption"}>Age: {data.age}</Typography></div>
      <div className={styles.description}><Typography variant={"subtitle2"}>{data.description}</Typography></div>
    </div>
  );
}

export default function ComplexBlock({ block }) {
  const { data } = block;

  const friends = data.reverse ? [...data.friends].reverse() : [...data.friends];

  return (
    <div className={styles.complexBlock}>
      <div className={styles.friendsList}>
        {friends.map((friend, i) => <Friend key={"friend" + i} data={friend.data}/>)}
      </div>
      <SchemaView schema={schema} />
    </div>
  )
}
