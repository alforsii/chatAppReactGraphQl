import { Messages } from "./Messages";
import { AddMessage } from "./AddMessage";

export default function Chat(props) {
  return (
    <div
      style={{
        maxHeight: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Messages username={props.username} />
      <AddMessage username={props.username} />
    </div>
  );
}
