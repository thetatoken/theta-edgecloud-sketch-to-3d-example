import './styles/App.css'
import {SketchTo3dView} from "./SketchTo3dView.jsx";

function App() {

    return (
        <>
            <Header/>

            <SketchTo3dView/>

            <Footer/>
        </>
    )
}

export default App


const Header = () => {
    return (<>
            <h1>Sketch to 3D</h1>
        </>
    )
}

const Footer = () => {
    return (
        <div>
            <a href="https://www.thetaedgecloud.com" target="_blank">
                <img src={"https://www.thetaedgecloud.com/images/edgecloud-logo.svg"} className="logo"
                     alt="Theta Edge Cloud logo"/>
            </a>
        </div>
    )
}