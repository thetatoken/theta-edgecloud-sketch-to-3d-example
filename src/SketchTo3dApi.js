const ApiUrl = import.meta.env.VITE_API_URL

let eventSource = null;


/**
 * Generate a 2D image from a sketch
 * @param {File} file - The sketch image file
 * @param {string} prompt - The prompt for the image generation
 * @param {string} negativePrompt - The negative prompt for the image generation
 * @param {function} onEvent - A callback function to handle events during the generation process
 * @returns {string} the path of the generated 2D image
 */
export const generate2d = async (file, prompt, negativePrompt, onEvent) => {
    const sessionHash = Math.random().toString(36).substring(2, 12);

    const sketchPath = await uploadImage(file);

    console.log('sketchPath')
    console.log(sketchPath)

    const sketchPngPath = await createEventSource(
        sessionHash,
        0,
        sketchToSketchPngBody(sketchPath, getUrlFromPath(sketchPath), file, sessionHash),
        onEvent)

    const image2dPath = await createEventSource(
        sessionHash,
        1,
        sketchPngTo2dBody(sketchPngPath, getUrlFromPath(sketchPngPath), file, sessionHash, prompt, negativePrompt),
        onEvent)

    return await createEventSource(
        sessionHash,
        2,
        image2dToImage2d2Body(image2dPath, getUrlFromPath(image2dPath), file, sessionHash),
        onEvent);
}

/**
 * Generate a 3D object from a 2D image
 * @param {string} imagePath - The path of the 2D image
 * @param {function} onEvent - A callback function to handle events during the generation process
 * @returns {string} the path of the generated 3D object
 */
export const generate3d = async (imagePath, onEvent) => {
    const sessionHash = Math.random().toString(36).substring(2, 12);

    return await createEventSource(
        sessionHash,
        4,
        image2dToObjBody(imagePath, getUrlFromPath(imagePath), sessionHash),
        onEvent);
}

export const stopEventStreams = () => {
    if (eventSource) {
        eventSource.close()
        eventSource = null
    }
}

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('files', file, file.name);

    try {
        const response = await fetch(`${ApiUrl}/upload`, {
            method: 'POST',
            body: formData
        })
        const json = await response?.json();
        return json?.[0]
    } catch (e) {
        console.log(e)
    }
}

const createEventSource = async (sessionHash, fnIndex, body, onEvent) => {
    return new Promise((resolve) => {

        if (eventSource) {
            eventSource.close()
            eventSource = null
        }

        eventSource = new EventSource(`${ApiUrl}/queue/join?fn_index=${fnIndex}&session_hash=${sessionHash}`);
        eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data)

            switch (data.msg) {
                case 'process_completed':
                    if (data.success) {
                        resolve(data.output.data[0].path)
                    } else {
                        onEvent && onEvent({msg: 'error', error: "Failed to generate"})
                    }
                    eventSource.close()
                    break;
                case 'send_data':
                    queueData(body, data.event_id, onEvent)
                    break;
                case 'estimation':
                    onEvent && onEvent(data)
                    break;
                default:
                    break;
            }
        };

        eventSource.onerror = (e) => {
            if (e.readyState === EventSource.CONNECTING) {
                return
            }

            // onError event

            eventSource.close()
        };
    });
}

const queueData = async (body, eventId, onEvent) => {

    const response = await fetch(`${ApiUrl}/queue/data`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...body, event_id: eventId}),
    });

    const json = await response?.json();

    if (!response.ok) {
        let errorMessage = json?.detail || 'Failed to generate'
        onEvent && onEvent({msg: 'error', error: errorMessage})

        throw new Error(errorMessage)
    }
}

export const getUrlFromPath = (path) => {
    return `${ApiUrl}/file=${path}`
}

const sketchToSketchPngBody = (sketchPath, sketchUrl, file, sessionHash) => {
    return {
        data: [
            {
                "background": {
                    "mime_type": "",
                    "orig_name": "background.png",
                    "path": sketchPath,
                    "size": file.size,
                    "url": sketchUrl
                },
                "composite": {
                    "mime_type": "",
                    "orig_name": "composite.png",
                    "path": sketchPath,
                    "size": file.size,
                    "url": sketchUrl
                },
            }
        ],
        session_hash: sessionHash,
        fn_index: 0,
        trigger_id: 30,
        event_data: null,
    }
}

const sketchPngTo2dBody = (sketchPath, sketchUrl, file, sessionHash, prompt, negativePrompt) => {
    return {
        "data": [
            {
                "mime_type": null,
                "orig_name": "image.png",
                "path": sketchPath,
                "size": null,
                "url": sketchUrl
            },
            "stablediffusionapi/rev-animated-v122-eol",
            "lllyasviel/control_v11p_sd15_lineart",
            512,
            512,
            true,
            1,
            prompt,
            negativePrompt,
            1,
            7.5,
            30,
            "DDIM",
            0,
            "Lineart"
        ],
        "event_data": null,
        "fn_index": 1,
        "session_hash": sessionHash,
        "trigger_id": 30
    }
}

const image2dToImage2d2Body = (image2dPath, image2dUrl, file, sessionHash) => {
    return {
        "data": [
            {
                "mime_type": null,
                "orig_name": "image.png",
                "path": image2dPath,
                "size": null,
                "url": image2dUrl
            },
            true,
            0.85,
        ],
        "event_data": null,
        "fn_index": 2,
        "session_hash": sessionHash,
        "trigger_id": 30
    }
}

const image2dToObjBody = (image2dPath, image2dUrl, sessionHash) => {
    return {
        "data": [
            {
                "mime_type": null,
                "orig_name": "image.png",
                "path": image2dPath,
                "size": null,
                "url": image2dUrl
            },
            256,
        ],
        "event_data": null,
        "fn_index": 4,
        "session_hash": sessionHash,
        "trigger_id": 35
    }
}
