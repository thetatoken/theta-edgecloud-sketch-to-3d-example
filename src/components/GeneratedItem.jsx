import React from "react";
import {GeneratingMode} from "../constants.js";
import {LoadingItem} from "./LoadingItem.jsx";
import {BiDownload} from "react-icons/bi";
import {ObjViewer} from "./ObjViewer.jsx";
import {ImageViewer} from "./ImageViewer.jsx";

const GeneratedItem = ({
                           mode,
                           item,
                           isGenerating,
                           onStopGenerating,
                           onClear,
                           onGenerate,
                           isGenerateBtnDisabled,
                           badgeText,
                           idleIcon,
                       }) => {

    if (isGenerating) {
        return (
            <div className="SketchTo3d__GeneratedItemWrapper">
                <LoadingItem/>

                <div className="SketchTo3d__GeneratedItemWrapper__LeftBadge">{badgeText}</div>

                <button onClick={onStopGenerating}>Stop generating</button>
            </div>)
    }

    if (!item) {
        return (
            <div className="SketchTo3d__GeneratedItemWrapper">
                <div className={"GeneratedItem"}>
                    <div className={"GeneratedItem__Idle"}>
                        {idleIcon}
                    </div>
                </div>

                <div className="SketchTo3d__GeneratedItemWrapper__LeftBadge">{badgeText}</div>

                <button onClick={onGenerate}
                        disabled={isGenerateBtnDisabled}>Generate {mode}</button>
            </div>
        )
    }


    const viewer = mode === GeneratingMode.TwoD
        ? <ImageViewer url={item}/>
        : <ObjViewer url={item}/>

    return (
        <div className="SketchTo3d__GeneratedItemWrapper">
            <div className={"GeneratedItem"}>
                {viewer}

                <div className={"GeneratedItem__DownloadWrapper"}>
                    <a href={item} download target={"_blank"}><BiDownload/></a>
                </div>
            </div>

            <div className="SketchTo3d__GeneratedItemWrapper__LeftBadge">{badgeText}</div>

            <button onClick={() => onClear(mode)}>Clear</button>
        </div>
    );
};

export default GeneratedItem;