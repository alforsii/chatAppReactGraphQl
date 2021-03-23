import { Container, Row, Col } from "react-bootstrap";
import { Messages } from "./Messages";
import { AddMessage } from "./AddMessage";
import UserChats from "./UserChats";
import ChatUsers from "./ChatUsers";

export default function Chat(props) {
  const chatId = props?.match?.params?.id;

  return (
    <Container>
      <Row className="row row-cols-2 g-2">
        <Col md={4} lg={4}>
          <UserChats updateState={props.updateState} userId={props.userId} />
          <ChatUsers
            chats={props.chats}
            chatId={chatId}
            currentUserId={props.userId}
          />
        </Col>

        <Col md={8} lg={8}>
          <Messages username={props.username} chatId={chatId} />
          {chatId && (
            <AddMessage
              username={props.username}
              chatId={chatId}
              userId={props.userId}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
