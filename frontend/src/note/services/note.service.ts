import {NoteState} from "../note";


class _NoteService {

    async getNote(id: string, password: string): Promise<Response> {
        return await fetch(`/api/notes/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password})
        });
    }

    async createNote(noteState: NoteState): Promise<Response> {
        const {passwordProtected, defaultText, ...rest} = noteState;
        return await fetch('/api/notes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rest)
        });
    }
}


export const NoteService = new _NoteService();