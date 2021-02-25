import MUIRichTextEditor from 'mui-rte'
import {Checkbox, FormControlLabel, FormGroup, makeStyles, TextField} from "@material-ui/core";
import {NoteState} from "./note";
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {convertToRaw, EditorState} from "draft-js";
import {useEffect} from "react";

export interface NoteCreateFormProps {
    state: NoteState;
    onChange: (note: NoteState) => void;
}

const useStyles = makeStyles({
    rte: {
        height: '100%',
        overflowY: 'scroll'
    }
});

export function NoteCreateForm({state, onChange}: NoteCreateFormProps) {
    const classes = useStyles();

    useEffect(() => {
        if(!state.passwordProtected) {
            handleChange('password', undefined);
        }
    }, [state.passwordProtected])

    const handleChange = (name: keyof NoteState, value: unknown) => {
        onChange({
            ...state,
            [name]: value
        })
    }

    const handleRTEChange = (editorState: EditorState) => handleChange('textModel', convertToRaw(editorState.getCurrentContent()));

    const enabledControls = [
        "title",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "numberList",
        "bulletList",
    ]

    return (
        <>
            <div className={classes.rte}>
                <MUIRichTextEditor label="Create your awesome note here!" onChange={(e) => handleRTEChange(e)}
                                   controls={enabledControls} defaultValue={state.defaultText}/>
            </div>
            <FormGroup>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                   <KeyboardDateTimePicker
                    variant="inline"
                    ampm={false}
                    label="Valid to"
                    value={state.validTo}
                    onChange={(date) => handleChange('validTo', date)}
                    onError={console.log}
                    disablePast
                    format="yyyy/MM/dd HH:mm"
                />
                </MuiPickersUtilsProvider>
                <FormControlLabel
                    control={<Checkbox checked={state.passwordProtected}
                                       onChange={(e) => handleChange('passwordProtected', e.target.checked)}
                                       name="passwordProtected"/>}
                    label="Make note private"
                />
                {state.passwordProtected &&
                <TextField label="Password" type="password" name="password" value={state.password}
                           onChange={(e) => handleChange('password', e.target.value)}/>}
            </FormGroup>
        </>
    )
}

