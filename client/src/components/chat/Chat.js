import { Messages } from "./Messages";
import { AddMessage } from "./AddMessage";

export default function Chat(props) {
  return (
    <div>
      <h2
        style={{
          position: "fixed",
          top: 0,
          left: 50,
        }}
      >
        Chat group
      </h2>
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
        <AddMessage />
      </div>
    </div>
  );
}
