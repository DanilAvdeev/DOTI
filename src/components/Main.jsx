import {Col, Container, Row} from "react-bootstrap";
import Vernam from "./Vernam";
import Gost from "./Gost";
import Hash from "./Hash";

const Main = () => {

    return (
        <Container className="App">
            <Row className="App-header">
                <Col>
                    <div>
                        Курс "Защита информации".
                    </div>
                    <div>
                        Лабораторная работа №2. Вариант №1
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col className="mb-3">
                    <Vernam/>
                </Col>
                <Col className="mb-3">
                    <Gost/>
                </Col>
                <Col className="mb-3">
                    <Hash/>
                </Col>
            </Row>
        </Container>
    );
}

export default Main