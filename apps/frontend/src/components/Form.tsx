import React, { useState } from "react";
import '../url.css';

type Props = {
    onSend: (url:string) => void;
}
const Form: React.FC<Props> = ({onSend}) => {
const [input,setInput] = useState<string>('');

const clickHandler = () => {
    onSend(input);
    setInput('');
}

return (
    <div className="input-form">
        <h1 className="input-title">URL Scanner</h1>
        <input  className="url-input" type="text" placeholder="https://example.com" onChange={(e) => {setInput(e.target.value)}} value={input}/>
        <button className="submit-btn" onClick={clickHandler}>Scan</button>
    </div>
)
}

export default Form;