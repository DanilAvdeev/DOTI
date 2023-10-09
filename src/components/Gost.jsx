import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {decode, encode, keyGen} from "../ciphers/gost";

/*
мусорная компонента получится походу
шифрование блоков это неприятно:(
*/
const Gost = () => {
    const [file, setFile] = useState();//изначальный файл можно убрать, но удобно брать тип файла)
    const [blob, setBlob] = useState();
    const [key, setKey] = useState();
    const [encryptedData, setEncryptedData] = useState();
    const [decryptedData, setDecryptedData] = useState();

    const handleKeyGen = () => {
        let newKey = keyGen().slice()
        setKey(newKey);
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setBlob(new Blob([e.target.files[0]], {type: e.target.files[0].type}))
    }

    async function handleDownloadInit() {
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a")
        a.href=url;
        a.download=file.name;
        document.body.append(a);
        a.style="display: none";
        a.click();
        a.remove();
    }

    const handleDownloadEncrypt = () => {
        let newBlob = new Blob([encryptedData], {type: file.type})
        let url = URL.createObjectURL(newBlob);
        let a = document.createElement("a")
        a.href=url;
        a.download="encrypt_" + file.name;
        document.body.append(a);
        a.style="display: none";
        a.click();
        a.remove();
    }

    const handleDownloadDecrypt = () => {
        let newBlob = new Blob([decryptedData], {type: file.type})
        let url = URL.createObjectURL(newBlob);
        let a = document.createElement("a")
        a.href=url;
        a.download="decrypt_" + file.name ;
        document.body.append(a);
        a.style="display: none";
        a.click();
        a.remove();
    }

    async function handleEncryption() {
        let encryptedData = await encode(blob)
        setEncryptedData(encryptedData);
    }

    async function handleDecryption() {
        let decryptedData = await decode(encryptedData)
        setDecryptedData(decryptedData);
    }

    const cleanAll = () => {
      setFile(null);
      setBlob(null);
      setKey(null);
      setEncryptedData(null);
      setDecryptedData(null);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title style={{textAlign: "center"}}>
                    Шифрование ГОСТ 28147-89
                </Card.Title>
                <Card.Subtitle className="mt-3 mb-2">1. Прикрепите текстовый файл</Card.Subtitle>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file" multiple={false} onChange={handleFileChange}/>
                </Form.Group>
                {file &&
                    <Row className="mt-3">
                        <Col>
                            <Button onClick={handleKeyGen}>
                                2. Сгенерировать ключ
                            </Button>
                        </Col>
                    </Row>
                }
                {key && <div style={{maxWidth:"400px"}}>Ключ: {key}</div>}
                {key &&
                        <Row className="mt-3">
                            <Col>
                                <Button onClick={handleEncryption}>
                                    3. Зашифровать
                                </Button>
                            </Col>
                        </Row>
                }
                {encryptedData &&
                    <Row className="mt-3">
                            <Col>
                                <Button onClick={handleDownloadInit}>
                                    4. Скачать изначальный файл
                                </Button>
                            </Col>
                    </Row>
                }
                {encryptedData &&
                    <Row className="mt-3">
                            <Col>
                                <Button onClick={handleDownloadEncrypt}>
                                    5. Скачать зашифрованный файл
                                </Button>
                            </Col>
                    </Row>
                }
                {encryptedData &&
                    <Row className="mt-3">
                        <Col>
                            <Button onClick={handleDecryption}>
                                6. Расшифровать зашифрованный файл
                            </Button>
                        </Col>
                    </Row>
                }
                {decryptedData &&
                    <Row className="mt-3">
                            <Col>
                                <Button onClick={handleDownloadDecrypt}>
                                    7. Скачать расшифрованный файл
                                </Button>
                            </Col>
                    </Row>
                }
                <Row className="mt-3">
                        <Col>
                            <Button variant="danger" onClick={cleanAll}>
                                Очистка
                            </Button>
                        </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default Gost;