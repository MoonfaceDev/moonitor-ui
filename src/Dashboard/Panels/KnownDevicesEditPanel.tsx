import React, {useCallback, useEffect, useState} from "react";
import {DialogBox, DialogHeader} from "../Components";
import MonacoEditor, {OnValidate} from "@monaco-editor/react";
import {fetchUpdateDevicesConfig, fetchViewDevicesConfig} from "../../APIRequests";
import Loading from "../../Loading/Loading";
import {useMobile} from "../../Utils";
import {useSnackbar} from "notistack";

function KnownDevicesEditPanel({visible, closePanel}: { visible: boolean, closePanel: () => void }) {
    const isMobile = useMobile();
    const [data, setData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [valid, setValid] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (!visible) {
            return;
        }
        setLoading(true);

        fetchViewDevicesConfig()
            .then(result => {
                setData(result);
                setLoading(false);
            });
    }, [visible]);

    const saveData = useCallback(() => {
        if (!valid) {
            enqueueSnackbar(errors.join('\n'), {variant: 'error'});
            return;
        }
        setLoading(true);
        fetchUpdateDevicesConfig(data)
            .then(() => {
                setLoading(false);
                enqueueSnackbar('Successfully saved known devices', {variant: 'success'});
                closePanel();
            })
            .catch(reason => {
                setLoading(false);
                enqueueSnackbar(reason, {variant: 'error'});
            });
    }, [valid, errors, data]);

    const handleEditorValidation: OnValidate = useCallback((markers) => {
        const errorMessages = markers.map(
            ({startLineNumber, message}) => `line ${startLineNumber}: ${message}`
        );
        setValid(errorMessages.length === 0);
        setErrors(errorMessages);
    }, []);
    return (
        <>
            <Loading visible={loading}/>
            <DialogBox visible={visible}>
                <DialogHeader title='Known Devices' onCancel={closePanel} onConfirm={saveData}/>
                <div style={{
                    padding: 16,
                    paddingTop: 0
                }}>
                    <MonacoEditor
                        options={{
                            minimap: {
                                enabled: false
                            }
                        }}
                        defaultLanguage="json"
                        theme="vs-dark"
                        value={data}
                        height={isMobile ? 400 : 600}
                        onChange={data => {
                            if (data === undefined) {
                                return;
                            }
                            setData(data);
                        }}
                        onValidate={handleEditorValidation}
                        beforeMount={(monaco) => {
                            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                                validate: true,
                                schemas: [{
                                    uri: 'device-config',
                                    fileMatch: ['*'],
                                    schema: {
                                        title: 'Devices config',
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            required: ['name', 'mac', 'type'],
                                            properties: {
                                                name: {
                                                    type: 'string'
                                                },
                                                mac: {
                                                    type: 'string'
                                                },
                                                type: {
                                                    type: 'string'
                                                }
                                            },
                                            additionalProperties: false
                                        }
                                    }
                                }]
                            });
                        }}
                    />
                </div>
            </DialogBox>
        </>
    );
}

export default KnownDevicesEditPanel;