import {Col, InputGroup, Row, Form, Button, Card} from "react-bootstrap";
import {useState} from "react";
import {encryptVernam, decryptVernam, keygen} from "../ciphers/vernam";

const Vernam = () => {
    const [text, setText] = useState("")
    const [key, setKey] = useState("")
    const [encrypted, setEncrypted] = useState("")
    const [decrypted, setDecrypted] = useState("")
    
    const handleEncryption = () => {
        setEncrypted(encryptVernam(text, key))
    }

    const handleDecryption = () => {
        setDecrypted(decryptVernam(encrypted, key))
    }

    const handleKeyGen = () => {
        setKey(keygen(text))
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title style={{textAlign: "center"}}>
                    Шифрование Вернама
                </Card.Title>
                <Card.Subtitle>Сначала введите открый текст, затем нажмите кнопку сгенерировать ключ</Card.Subtitle>
                <InputGroup className={"mb-3 mt-3"}>
                    <Form.Control
                        placeholder="Введите текст для шифрования Вернама"
                        name="text"
                        value={text}
                        onChange={event => setText(event.target.value)}
                    />
                </InputGroup>
                <Row className="mt-3">
                    <Col>
                        <Button onClick={handleKeyGen}>
                            Сгенерировать ключ
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Card.Subtitle className="mb-2 text-muted" style={{}}>Результат генерации:</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{key}</Card.Subtitle>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Button onClick={handleEncryption}>
                            Зашифровать
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Card.Subtitle className="mb-2 text-muted" style={{}}>Результат шифрования:</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{encrypted}</Card.Subtitle>
                </Row>
                <InputGroup >
                    <Form.Control
                        placeholder="Введите текст для расшифрования Вернама"
                        name="encrypted"
                        value={encrypted}
                        onChange={event => setEncrypted(event.target.value)}
                    />
                </InputGroup>
                <Row className="mt-3">
                    <Col>
                        <Button onClick={handleDecryption}>
                            Расшифровать
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Card.Subtitle className="mb-2 text-muted" style={{}}>Результат расшифрования:</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{decrypted}</Card.Subtitle>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default Vernam;