import {Button, Card, CardActions, CardContent, CardHeader, makeStyles, Tab, Tabs} from "@material-ui/core";
import {useState} from "react";
import * as React from "react";
import {NoteCreateForm} from "./NoteCreateForm";
import {HandWritingCanvas} from "../handwriting/HandWritingCanvas";
import {ConvertToText} from "../handwriting/services/ConvertToText";
import {HandwritingState} from "../handwriting/handwriting";
import {Note, NoteResponse, NoteState} from "./note";
import {NoteService} from "./services/note.service";
import {RawDraftContentState} from "draft-js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    card: {
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr) auto',
        height: '100%'
    },
    outerContent: {
        display: 'grid',
        gridTemplateRows: 'auto minmax(0, 1fr)',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
});

const hasTextContent = (state: RawDraftContentState | undefined) => state?.blocks?.some((block) => block.text.trim().length)

export function NoteCreateCard() {
    const classes = useStyles();
    const history = useHistory();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [handwritingState, setHandwritingState] = useState<HandwritingState>({
        width: 0,
        height: 0,
        language: 'en',
        lines: []
    });
    const [formState, setFormState] = useState<NoteState>({
        validTo: null,
        passwordProtected: false
    })


    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => setSelectedTab(newValue)

    const convertToText = async () => {
        const text = await ConvertToText.convert(handwritingState);
        setSelectedTab(0);
        setFormState({...formState, defaultText: text});
    }

    const isSaveDisabled = () => {
        const {textModel, passwordProtected, password} = formState;
        return selectedTab === 1 || !hasTextContent(textModel) || (passwordProtected && !password);
    }

    const handleSave = async () => {
        const response = await NoteService.createNote(formState);
        if (response.ok) {
            history.push((await response.json() as NoteResponse).id);
        }
    }

    return (
        <Card className={classes.card}>
            <CardHeader title="Create a note"/>
            <CardContent className={classes.outerContent}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="Text editor"/>
                    <Tab label="Handwriting"/>
                </Tabs>
                <div className={classes.content}>
                    {selectedTab === 0 && (
                        <NoteCreateForm onChange={setFormState} state={formState}/>
                    )}
                    {selectedTab === 1 && (
                        <HandWritingCanvas onChange={setHandwritingState} state={handwritingState}/>
                    )}
                </div>
            </CardContent>
            <CardActions>
                {selectedTab === 1 && (
                    <Button onClick={convertToText}>Convert to text</Button>
                )}
                <Button disabled={isSaveDisabled()} onClick={handleSave}>Save</Button>
            </CardActions>
        </Card>
    )
}
