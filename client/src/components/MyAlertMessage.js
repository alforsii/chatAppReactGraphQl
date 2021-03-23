import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Modal } from "react-bootstrap";

export default function MyAlertMessage({ msg, success, msgId }) {
  const [smShow, setSmShow] = useState(false);

  useEffect(() => {
    if (msg) {
      setSmShow(true);
      setTimeout(() => {
        setSmShow(false);
      }, 2000);
    }
  }, [msg, msgId]);

  return (
    <Modal
      size="sm"
      show={smShow}
      onHide={() => {
        setSmShow(false);
      }}
      aria-labelledby="alert-modal"
    >
      <Alert
        style={{ margin: 0 }}
        variant={success ? "success" : "danger"}
        onClose={() => setSmShow(false)}
        dismissible
      >
        <Alert.Heading style={{ fontSize: 16 }}>{msg}</Alert.Heading>
      </Alert>
    </Modal>
  );
}
