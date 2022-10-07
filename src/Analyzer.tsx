import { Component, createEffect, createSignal, onMount } from "solid-js";

import styles from './Analyzer.module.css';

export interface AnalyzerProps {
    mediaDevice: MediaDeviceInfo;
}

/**
 * Seems not possible to connect to audio output to capture stream acrually being played on a PC:(
 * 
 * @param props 
 * @returns 
 */
const Analyzer: Component<AnalyzerProps> = (props: AnalyzerProps) => {
    let canvas: HTMLCanvasElement;

    const [ctx2d, setCtx2d] = createSignal<CanvasRenderingContext2D|null>(null);
    const [ctxAudio, setCtxAudio] = createSignal<AudioContext>();
    const [analyser, setAnalyser] = createSignal<AnalyserNode>();
    const [source, setSource] = createSignal<MediaStreamAudioSourceNode>();
    const [destination, setDestination] = createSignal<MediaStreamAudioDestinationNode>();

    onMount(() => {
        const ctx2d = canvas.getContext('2d');
        setCtx2d(ctx2d);

        if(ctx2d) {
            const gradient = ctx2d.createLinearGradient(0, 0, 0, 200);
            gradient?.addColorStop(1, '#ADD8E6');
            gradient?.addColorStop(0.65, '#576D74');
            gradient?.addColorStop(0.45, '#FFAA00');
            gradient?.addColorStop(0, '#FF0000');
            ctx2d.fillStyle = gradient || undefined;
        }
    });

    const draw = () => {
        var array = new Uint8Array(analyser()?.frequencyBinCount || 4);
        analyser()?.getByteFrequencyData(array);
        ctx2d()?.clearRect(0, 0, 512, 256);
        for (var i = 0; i < array.length; i++) {
            ctx2d()?.fillRect(i * 2, 256-array[i], 1, 256);
        }
        requestAnimationFrame(draw);
    }

    const cleanup = () => {
        source()?.disconnect();
        destination()?.disconnect();
    }

    createEffect(async () => {
        if(props.mediaDevice) {
            // cleanup();
            console.log(`from analyzer:`, props.mediaDevice);
            const context = new AudioContext();
            const analyser = context.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.75;
            setAnalyser(analyser);
            setCtxAudio(context);

            const mediaStream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: props.mediaDevice.deviceId}});
            // console.log(mediaStream.getTracks()[0].getSettings());
            console.log(mediaStream, mediaStream.getTracks());
            const source = ctxAudio()?.createMediaStreamSource(mediaStream);
            const dest = ctxAudio()?.createMediaStreamDestination();

            if(dest) {
                source?.connect(dest);
                const splitter = dest.context.createChannelSplitter(1);
                splitter.connect(analyser, 0);
            }
            source?.connect(analyser);

            console.log(source?.numberOfInputs, source?.numberOfOutputs);
            console.log(source?.channelCount, source?.channelCountMode, source?.channelInterpretation);
            console.log(dest?.numberOfInputs, dest?.numberOfOutputs);
            console.log(dest?.channelCount, dest?.channelCountMode, dest?.channelInterpretation);
            
            console.log(dest?.stream.active);
            setSource(source);
            setDestination(destination);
            
            requestAnimationFrame(draw);
        }
    });

    return (
        <canvas ref={canvas} class={styles.analyzer}></canvas>
    )
}

export default Analyzer;