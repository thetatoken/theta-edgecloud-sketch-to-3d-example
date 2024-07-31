import React from "react";

export const ImageViewer = ({url}) => {
    return (
        <div className={"GeneratedItem__Image"}>
            <a href={url} target={"_blank"}>
                <img src={url} alt={"result"}/>
            </a>
        </div>
    )
}