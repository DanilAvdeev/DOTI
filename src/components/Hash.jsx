import {Button, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useState} from "react";
import sha1 from "../ciphers/hash";

const Hash = () => {
    const [text, setText] = useState("");
    const [hash, setHash] = useState();

    const handleHash = () => {
        let newHash = sha1(text);
        setHash(newHash);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title style={{textAlign: "center"}}>
                    Хеш-функция SHA-1
                </Card.Title>
                <InputGroup className={"mb-3 mt-3"}>
                    <Form.Control
                        placeholder="Введите текст для хэширования"
                        name="text"
                        value={text}
                        onChange={event => setText(event.target.value)}
                    />
                </InputGroup>
                <Row className="mt-3">
                    <Col>
                        <Button onClick={handleHash}>
                            Хэшировать
                        </Button>
                    </Col>
                </Row>
                {hash &&
                    <>
                        <Card.Subtitle className="mt-3">Hash: </Card.Subtitle>
                        <Card.Subtitle>{hash}</Card.Subtitle>
                    </>
                }
            </Card.Body>
        </Card>
    );
}

export default Hash;