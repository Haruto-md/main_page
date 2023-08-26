let audioContext;
let mediaRecorder;
let audioChunks = [];

function startRecording() {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioContext = new AudioContext();
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.start();
        })
        .catch(error => {
            console.error('音声録音の初期化に失敗しました:', error);
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);

    // Unity側の関数を呼び出してAudioClipを受け渡す
    unityInstance.SendMessage('AudioManager', 'ReceiveAudioClip', url);
};
