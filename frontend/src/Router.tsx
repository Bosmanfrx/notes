import {BrowserRouter, Route, Switch} from "react-router-dom";
import {NoteCreateCard} from "./note/NoteCreateCard";
import React from "react";
import {NoteViewCard} from "./note/NoteViewCard";

export function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <NoteCreateCard/>
                </Route>
                <Route path="/:id">
                    <NoteViewCard/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}