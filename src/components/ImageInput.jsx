import '../styles/ImageInput.css'
import React, {useEffect, useState} from "react";
import {CgClose} from "react-icons/cg";

export const ImageInput = ({children, onChange, file, name, onRemove, formats, ...props}) => {

    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState(null);


    useEffect(() => {
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => setPreview(e.target.result);
            fileReader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [file]);

    const onImageSelected = (e) => {
        setDragging(false)
        onChange(e.target.files[0], e.target.name);
    }

    const onRemoveClick = () => {
        onRemove(name);
    }

    return (
        <div className={"ImageInput"}>
            {preview ?
                <>
                    <img className={"ImageInput__ImageUploaded"}
                         src={preview}/>
                    <div className={"ImageInput__ImageUploaded__Close"} onClick={onRemoveClick}><CgClose/></div>
                </>
                : <>
                    <div
                        className={`ImageInput__Label ${dragging ? "ImageInput__Label--dragover" : ""}`}
                        onClick={() => document.querySelector(`input[name="${name}"]`).click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDragEnter={() => setDragging(true)}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                const file = e.dataTransfer.files[0];
                                if (formats && formats.indexOf(file.type) === -1
                                    || file.type.indexOf("image/") === -1) {
                                    console.log("Invalid file type");
                                } else {
                                    onChange(file, name);
                                }
                            }
                        }}
                    >
                        <div><span className={"ImageInput__Label--Green"}>Upload a sketch</span></div>
                        <div>or</div>
                        <div>drag image here</div>

                    </div>
                    <input type="file" name={name} accept={formats ? formats : "image/*"}
                           onChange={onImageSelected}/></>}

            {children}
        </div>
    )
}