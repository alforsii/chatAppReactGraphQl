import { Container, Row, Col } from "react-bootstrap";
import { Messages } from "./Messages";
import { AddMessage } from "./AddMessage";
import UserChats from "./UserChats";
import ChatUsers from "./ChatUsers";

export default function Chat(props) {
  const chatId = props?.match?.params?.id;

  return (
    <Container>
      <Row>
        <Col>
          <UserChats userId={props.userId} />
          <ChatUsers chatId={chatId} currentUserId={props.userId} />
        </Col>

        <Col>
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
