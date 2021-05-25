import React, { useEffect, useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import assignment from "./assignment.xlsx";
// import Autosuggest from 'react-autosuggest';
import Example from "./component/suggestion";

function App() {
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [searching , setSearching] = useState(null);

  useEffect(() => {
    var oReq = new XMLHttpRequest();
    oReq.open("get", assignment, true);
    oReq.responseType = "blob";
    oReq.onload = function () {
      var blob = oReq.response;
      readExcel(blob);
    };
    oReq.send();
  }, []);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
      setItems2(d);
    });
  };

  const searchHandler = (e) => {
    let val = e.target.value;
    setSearching(...val , val)
    let result = items2.filter((item, ind) => {
      return item["Constituency Name"] &&
        item["Constituency Name"].toLowerCase().includes(val.toLowerCase())
        ? item
        : null;
    });
    setItems(result);

    console.log(searching)
  };
  return (
    <div className="container-fluid">
      {/* <Example itemsend={items}/> */}
      <div style={{ marginTop: "20px" }}>
        <nav style={{ margin: "auto" }} class="navbar navbar-light bg-light">
          <form
            style={{ position: "absolute", left: "40%" }}
            class="form-inline"
          >
            <input
              class="form-control mr-sm-2"
              type="search"
              onChange={searchHandler}
              placeholder="By Constituency Name"
              aria-label="Search"
            />
            {/* <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
          </form>
        </nav>
      </div>

      {/* <table className="table container">
        <thead>
          <tr>
            <th scope="col">Constituency Name</th>
            <th scope="col">Winner</th>

            <th scope="col">Runner Up</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d, key) => {
            if (d["Constituency Name"])
              return (
                <tr key={key}>
                  <th>{d["Constituency Name"]}</th>
                  <th>{d.Candidate}</th>
                  <td>{d.Candidate_1}</td>
                </tr>
              );
          })}
        </tbody>
      </table> */}
{
  items && items.map((item , key)=>{
    console.log(item)
    if(key === 0){
      
      return   <div key={key[0]} style={{ display: "flex", flexWrap: "wrap" }}>
      <div className="winner shadow-lg p-3 mb-5 bg-white rounded">
     
        <ul class="list-group ">
          <li class="list-group-item active">Winner </li>
          <li class="list-group-item">{item["Constituency Name"]}</li>
          <li class="list-group-item">{item.Candidate}</li>
          <li class="list-group-item">{item.Votes}</li>
          <li class="list-group-item">{item["%"]}</li>
        </ul>
      </div>
      <div className="runner shadow-lg p-3 mb-5 bg-white rounded">
       
        <ul class="list-group">
          <li class="list-group-item active">Runner</li>
          <li class="list-group-item">{item["Constituency Name"]}</li>
          <li class="list-group-item">{item.Candidate_1}</li>
          <li class="list-group-item">{item.Votes_1}</li>
          <li class="list-group-item">{item["%_1"]}</li>
        </ul>
      </div>
    </div>
}


  })
}
    </div>
  );
}
export default App;
