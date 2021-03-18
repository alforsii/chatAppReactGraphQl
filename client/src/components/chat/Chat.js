import { Container, Row, Col } from "react-bootstrap";
import { Messages } from "./Messages";
import { AddMessage } from "./AddMessage";
import CreateChat from "./CreateChat";
import UserChats from "./UserChats";
import ChatUsers from "./ChatUsers";

export default function Chat(props) {
  const chatId = props?.match?.params?.id;

  return (
    <Container style={{ padding: 10 }}>
      <Row>
        {chatId ? (
          <>
            <Col md={4} lg={4}>
              <ChatUsers chatId={chatId} currentUserId={props.userId} />
            </Col>

            <Col md={8} lg={8}>
              <Messages username={props.username} chatId={chatId} />
              <AddMessage
                username={props.username}
                chatId={chatId}
                userId={props.userId}
              />
            </Col>
          </>
        ) : (
          <Col md={{ span: 6, offset: 3 }}>
            <UserChats userId={props.userId} />
            <CreateChat userId={props.userId} />
          </Col>
        )}
      </Row>
    </Container>
  );
}
