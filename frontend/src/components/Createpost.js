import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const navigate = useNavigate()

  // Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)


  useEffect(() => {

    // saving post to mongodb
    if (url) {

      fetch("http://localhost:5000/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          body,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            notifyA(data.error)
          } else {
            notifyB("Successfully Posted")
            navigate("/")
          }
        })
        .catch(err => console.log(err))
    }

  }, [url])


  // posting image to cloudinary
  const postDetails = () => {

    console.log(body, image)
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name", "cantacloud2")
    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.log(err))
    console.log(url)

  }


  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };
  return (
    <div className="createPost">
      {/* //header */}
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        <button id="post-btn" onClick={() => { postDetails() }}>Share</button>
      </div>
      {/* image preview */}
      <div className="main-div">
        <img
          id="output"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            loadfile(event);
            setImage(event.target.files[0])
          }}
        />
      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="data:image/jpeg;base64,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"
              alt=""
            />
          </div>
          <h5>Pragati</h5>
        </div>
        <textarea value={body} onChange={(e) => {
          setBody(e.target.value)
        }} type="text" placeholder="Write a caption...."></textarea>
      </div>
    </div>
  );
}
