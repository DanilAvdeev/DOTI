import './App.css';
import {Route, Routes} from "react-router";
import Main from "./components/Main";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />} />
            </Routes>
        </>
    );
}

export default App;
