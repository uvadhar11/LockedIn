import { useState } from "react";

function Inbox() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <div>
      <div className="w-2/3 float-left h-full">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-11/12 float-left h-6 border-b-2 bg-inherit"
            placeholder="Write something down..."
          />
          <button type="submit" className="hidden">
            Submit
          </button>
        </form>
        <br></br>
        {messages.map((message, index) => (
          <div key={index} className="p-2 border-b-2">
            {message}
          </div>
        ))}
      </div>
      <div className="flex-row float-right w-1/3 h-full">
        <div className="flex-1 w-full h-1/3">
          <h2>Todays Tasks</h2>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="flex-1 w-full h-1/3">
          <h2>Goals</h2>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="flex-1 w-full h-1/3">
          <h2>Parking Lot</h2>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Inbox;
