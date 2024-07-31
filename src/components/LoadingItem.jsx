import React from "react";

export const LoadingItem = () => {

    return (<div className={"GeneratedItem"}>
        <div className={"GeneratedItem__Loading"}>
            <div className={"GeneratedItem__Loading__TopWrapper"}/>

            <div className={"GeneratedItem__Loading__CenterWrapper"}>
                <div className={"loader"}/>
            </div>

            <div className={"GeneratedItem__Loading__BottomWrapper"}>Generation in progress...</div>
        </div>
    </div>)

}
