import {ChangeEvent, MutableRefObject, useEffect, useRef, useState} from "react";
import {Layer, Line, Stage} from "react-konva";
import {KonvaEventObject} from "konva/types/Node";
import {FormControl, InputLabel, makeStyles, MenuItem, Select} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {HandwritingState} from "./handwriting";

export interface HandWritingProps {
    state: HandwritingState
    onChange: (state: HandwritingState) => void;
}

const useStyles = makeStyles(() => ({
    content: {
        height: '100%',
        position: 'relative'
    },
    erase: {
        position: 'absolute',
        right: '8%',
        top: '8%'
    },
    language: {
        position: 'absolute',
        left: '5%',
        top: '5%',
        minWidth: 120
    }
}));

const useComponentSize = (componentRef: MutableRefObject<HTMLDivElement | null>) => {
    const [size, setSize] = useState({
        width: 0,
        height: 0
    });

    useEffect(() => {
        if (!componentRef.current) {
            return;
        }
        const sizeObserver = new ResizeObserver((entries) => {
            entries.forEach(({target}) => {
                setSize({width: target.clientWidth, height: target.clientHeight});
            });
        });
        sizeObserver.observe(componentRef.current as HTMLDivElement);

        return () => sizeObserver.disconnect();
    }, [componentRef]);

    return [size.width, size.height];
};

// TODO make more performant version. It's more of PoC
export function HandWritingCanvas({state, onChange}: HandWritingProps) {
    const [isDrawing, setDrawing] = useState<boolean>(false);
    const hostRef = useRef<HTMLDivElement | null>(null);
    const [width, height] = useComponentSize(hostRef);

    const classes = useStyles();

    const mouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        setDrawing(true);
        const pos = e?.target?.getStage()?.getPointerPosition();
        onChange({
            ...state,
            lines: [...state.lines, {points: [pos?.x ?? 0, pos?.y ?? 0]}],
            width,
            height
        });
    }

    const mouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing) {
            return;
        }
        e.evt.preventDefault();
        const {lines} = state;
        const stage = e.target.getStage();
        const point = stage?.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        onChange({
            ...state,
            lines: [
                ...lines.slice(0, -1),
                {
                    points: [
                        ...lastLine.points,
                        point?.x ?? 0,
                        point?.y ?? 0
                    ]
                }
            ]
        });
    }

    const mouseUp = () => setDrawing(false);

    const erase = () => onChange({...state, lines: []});

    const handleLanguageChange = (event: ChangeEvent<{ value: unknown }>) => {
        onChange({
                ...state,
                language: event.target.value as string
            });
    }

    return (
        <div ref={hostRef} className={classes.content}>
            <Stage width={width} height={height}
                   onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp}
                   onTouchStart={mouseDown} onTouchMove={mouseMove} onTouchEnd={mouseUp}>
                <Layer>
                    {state.lines.map((line, i) => (
                        <Line key={i} points={line.points} lineCap="round" lineJoin="round" strokeWidth={3}
                              stroke="#000000"/>
                    ))}
                </Layer>
            </Stage>
            <Delete className={classes.erase} onClick={erase}/>
            <FormControl className={classes.language}>
                <InputLabel>Language</InputLabel>
                <Select
                    value={state.language}
                    onChange={handleLanguageChange}
                >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'pl'}>Polish</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}
