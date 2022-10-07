import { Component, createEffect, createSignal, For } from "solid-js";

export interface SelectMediaDeviceProps {
    onMediaDeviceSelected: (device: MediaDeviceInfo) => void;
}

const SelectMediaDevice: Component<SelectMediaDeviceProps> = (props: SelectMediaDeviceProps) => {

    const [devices, setDevices] = createSignal<MediaDeviceInfo[] | null>(null);
    const [selected, setSelected] = createSignal<MediaDeviceInfo | null>(null);

    createEffect(async () => {
        setDevices(await navigator.mediaDevices.enumerateDevices());
        return true;
    });

    const selectedDeviceChanged = (e: Event) => {
        console.log(e);
        const id = (e.target as HTMLSelectElement).value;
        setSelected(devices()?.find((device => device.groupId === id)) || null);
        props.onMediaDeviceSelected(selected() || {} as MediaDeviceInfo);
    };

    return (
        <div>Media devices list:
            <select onchange={selectedDeviceChanged}>
                <For each={devices()}>
                    {(device, idx) => <option value={device.groupId}>[{device.kind}] {device.label || JSON.stringify(device)}</option>}
                </For>
            </select>
            <pre>{JSON.stringify(selected(), null, '  ')}</pre>
        </div>
    )
}

export default SelectMediaDevice;