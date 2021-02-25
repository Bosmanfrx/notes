import {HandwritingRequestOptions, HandWritingResponse, HandwritingState} from "../handwriting";
import {ContentState, convertFromHTML, convertToRaw} from "draft-js";

class _ConvertToText {

    readonly API_URL = 'https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8'

    async convert(options: HandwritingState): Promise<string> {
        const requestData = this.getRequestData(options);

        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        const data = await response.json() as HandWritingResponse;
        const text = `<p>${data[1][0][1][0]}</p>`;
        const contentHTML = convertFromHTML(text);
        const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
        return JSON.stringify(convertToRaw(state))
    }

    private getRequestData({width, height, lines, language}: HandwritingState): HandwritingRequestOptions {
        if (!lines || !language) {
            throw new Error('Data for hand writing recognition is missing');
        }
        const points = lines.map((line) => line.points)

        return {
            options: 'enable_pre_space',
            requests: [{
                writing_guide: {
                    writing_area_width: width ?? 600,
                    writing_area_height: height ?? 600
                },
                // Transforming our internal lines system for separate arrays of X and Y coordinates and additional
                // empty array because gods know why which can be consumed by Google API
                ink: points.map((p) => [
                    p.filter((line, i) => !(i % 2)),
                    p.filter((line, i) => i % 2),
                    []
                ]),
                language
            }]
        }
    }
}

export const ConvertToText = new _ConvertToText();
