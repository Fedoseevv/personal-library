import image from './loader.gif';
import './Loader.css';

export const Loader = () => {
    return (
        <div className={"loader_wrap"}>
            <img src={image} alt="loader"/>
        </div>
    )
}