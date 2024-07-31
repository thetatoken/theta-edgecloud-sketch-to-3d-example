import React, {useState} from "react";
import {ImageInput} from "./components/ImageInput";
import {TextInput} from "./components/TextInput";
import {generate2d, generate3d, getUrlFromPath, stopEventStreams} from "./SketchTo3dApi.js";
import './styles/SketchTo3d.css'
import GeneratedItem from "./components/GeneratedItem.jsx";
import {GeneratingMode} from "./constants.js";
import {BiImage} from "react-icons/bi";
import {GrThreeD} from "react-icons/gr";

export const SketchTo3dView = () => {

    const [inputData, setInputData] = useState({
        prompt: "",
        negativePrompt: "",
        imageFile: null,
    });
    const [isGenerating, setIsGenerating] = useState(GeneratingMode.OFF);
    const [imageGeneratedPath, setImageGeneratedPath] = useState(null)
    const [objectGeneratedUrl, setObjectGeneratedUrl] = useState(null)

    const onGenerate2d = async () => {
        setIsGenerating(GeneratingMode.TwoD)
        try {
            const image2dPath = await generate2d(inputData.imageFile, inputData.prompt,
                inputData.negativePrompt, onGenerateEvent)
            setImageGeneratedPath(image2dPath)
        } catch (e) {
            setIsGenerating(GeneratingMode.OFF);
            console.error(e)
        }
        setIsGenerating(GeneratingMode.OFF)
    };

    const onGenerate3d = async () => {
        setIsGenerating(GeneratingMode.ThreeD)
        try {
            const object3dPath = await generate3d(imageGeneratedPath, onGenerateEvent)
            setObjectGeneratedUrl(getUrlFromPath(object3dPath))
        } catch (e) {
            setIsGenerating(GeneratingMode.OFF);
            console.error(e)
        }
        setIsGenerating(GeneratingMode.OFF)
    };

    const onImageSelected = async (file) => {
        if (!file) return;
        setInputData((prevData) => ({
            ...prevData,
            imageFile: file,
        }));
    }

    const onPromptChanged = (event) => {
        const { name, value } = event.target;
        setInputData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const onGenerateEvent = (event) => {
        switch (event.msg) {
            case 'estimation':
                //estimation data is not used in this app
                break;
            case 'process_starts':
                //process_starts data is not used in this app
                break;
            case 'error':
            case 'unexpected_error':
                console.error(event.error)
                setIsGenerating(GeneratingMode.OFF);
                break;
        }
    }

    const onStopGenerating = () => {
        setIsGenerating(GeneratingMode.OFF)
        stopEventStreams()
    }

    const onRemoveImage = () => {
        setInputData((prevData) => ({
            ...prevData,
            imageFile: null,
        }));
    }

    const onClear = (mode) => {
        if (mode === GeneratingMode.TwoD) {
            setImageGeneratedPath(null)
        } else {
            setObjectGeneratedUrl(null)
        }
    }

    return (
        <div className="SketchTo3d">
            <div className="SketchTo3d__Container">
                <div className={"SketchTo3d__LeftSide"}>

                    <div className={"SketchTo3d__ImageInputWrapper"}>

                        <ImageInput file={inputData.imageFile}
                                    name={"image"}
                                    label={"Image"}
                                    onChange={onImageSelected}
                                    onRemove={onRemoveImage}
                                    formats={"image/jpeg, image/jpg, image/png"}/>

                    </div>
                </div>

                <div className={"SketchTo3d__RightSide"}>
                    <div className={"SketchTo3d__Prompts"}>
                        <TextInput name={"prompt"} value={inputData.prompt} onChange={onPromptChanged}
                                   placeholder={"Prompt"}/>
                        <TextInput name={"negativePrompt"} value={inputData.negativePrompt} onChange={onPromptChanged}
                                   placeholder={"Negative Prompt"}/>
                    </div>

                    <div className={"SketchTo3d__GeneratedItems"}>

                        <GeneratedItem
                            mode={GeneratingMode.TwoD}
                            item={imageGeneratedPath && getUrlFromPath(imageGeneratedPath)}
                            isGenerating={isGenerating === GeneratingMode.TwoD}
                            onStopGenerating={onStopGenerating}
                            onClear={onClear}
                            onGenerate={onGenerate2d}
                            isGenerateBtnDisabled={!inputData.imageFile}
                            badgeText={"2D image"}
                            idleIcon={<BiImage/>}
                        />

                        <GeneratedItem
                            mode={GeneratingMode.ThreeD}
                            item={objectGeneratedUrl}
                            isGenerating={isGenerating === GeneratingMode.ThreeD}
                            onStopGenerating={onStopGenerating}
                            onClear={onClear}
                            onGenerate={onGenerate3d}
                            isGenerateBtnDisabled={!imageGeneratedPath}
                            badgeText={"Output Model (OBJ Format)"}
                            idleIcon={<GrThreeD/>}
                        />

                    </div>
                </div>
            </div>

        </div>
    );
}