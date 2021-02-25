export interface Lines {
    points: number[]
}

export interface HandwritingState {
    width: number;
    height: number;
    language: string;
    lines: Lines[];
}

export interface HandwritingRequestOptions {
    options: string;
    requests: {
        ink: [number[], number[], unknown[]][];
        language: string;
        writing_guide: {
            writing_area_height: number;
            writing_area_width: number;
        }
    }[];
}

export type HandWritingResponse = [string, [string, string[], unknown[], {is_html_escaped: boolean}][]]
