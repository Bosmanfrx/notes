import {RawDraftContentState} from "draft-js";

export interface NoteResponse {
    id: string;
    textModel: RawDraftContentState;
}

export interface Note {
    id?: string;
    textModel?: RawDraftContentState;
    validTo?: string | null;
    password?: string;
}

export interface NoteState extends Note {
    passwordProtected: boolean;
    defaultText?: string;
}
