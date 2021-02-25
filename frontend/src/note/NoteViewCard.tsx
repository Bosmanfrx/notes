import {Button, Card, CardActions, CardContent, CardHeader, TextField} from "@material-ui/core";
import * as React from "react";
import {useEffect, useState} from "react";
import {NoteService} from "./services/note.service";
import {useParams} from "react-router"
import draftToHtml from 'draftjs-to-html';
import {NoteResponse} from "./note";


interface NoteViewParams {
    id: string;
}


export function NoteViewCard() {
    const [cardResponse, setCardResponse] = useState<Response>();
    const [password, setPassword] = useState<string>('');
    const [html, setHtml] = useState<string>('');
    const {id} = useParams<NoteViewParams>();

    useEffect(() => {
        fetchCardContent()
    }, [id]);

    const fetchCardContent = async () => {
        const response = await NoteService.getNote(id, password);
        setCardResponse(response);

        if(response.ok) {
            const data: NoteResponse = await response.json();
            setHtml(draftToHtml(data.textModel));
        }
    }

    const isForbidden = () => cardResponse?.status === 403;
    const notFound = () => cardResponse?.status === 404;
    const isOk = () => cardResponse?.ok;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const handleCopy = () => navigator.clipboard.writeText(window.location.href);

    const getTitle = () => {
        switch (true) {
            case isOk():
                return 'Note';
            case isForbidden():
                return 'Provide password';
            case notFound():
                return 'Ain\'t nobody here but us chickens';
        }
    }

    return (
        <Card>
            <CardHeader title={getTitle()}/>
            <CardContent>
                {isForbidden() &&
                <TextField value={password} onChange={handleChange} type="password" label="Password" fullWidth={true}/>}
                {isOk() && <div dangerouslySetInnerHTML={{__html: html}}/>}
            </CardContent>
            <CardActions>
                {isOk() && <Button onClick={handleCopy}>Copy link to clipboard</Button>}
                {isForbidden() && <Button onClick={fetchCardContent}>Send</Button>}
            </CardActions>
        </Card>
    )
}
