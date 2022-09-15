import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native'
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera'
import { BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner'

const App = () => {
    const devices = useCameraDevices()
    const device = devices.back

    const frameProcessor = useFrameProcessor(frame => {
        'worklet'

        const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], {
            checkInverted: true
        })

        console.log(detectedBarcodes)
    }, [])

    const [hasPermission, setHasPermission] = useState(false)
    useEffect(() => {
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'authorized')
        })()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            {device ? (
                hasPermission ? (
                    <Camera
                        style={StyleSheet.absoluteFillObject}
                        device={device}
                        isActive={true}
                        frameProcessor={frameProcessor}
                        frameProcessorFps={2}
                    />
                ) : (
                    <Text>No permissions</Text>
                )
            ) : (
                <ActivityIndicator color="white" />
            )}
        </SafeAreaView>
    )
}

export default App
