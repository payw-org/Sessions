// Video elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// Button elements
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

// 제공 옵션 (오디오 / 비디오)
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

let localStream;
let myConnection;
let remoteConnection;

// 시작
async function start() {
  startButton.disabled = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
  } catch (e) {
    alert(`권한 허용 바람 !`);
  }
}

// 상대방 찾기
async function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;

  // RTCPeerConnection 초기화
  myConnection = new RTCPeerConnection(null);
  remoteConnection = new RTCPeerConnection(null);

  // icecandidate = > 통신할 대상을 찾았는가?
  myConnection.addEventListener('icecandidate', e => onRemoteIceCandidate(myConnection, e));
  remoteConnection.addEventListener('icecandidate', e => onLocalIceCandidate(remoteConnection, e));

  // 상대방 상태 변경 감지
  myConnection.addEventListener('iceconnectionstatechange', e => onIceStateChange(myConnection, e));
  remoteConnection.addEventListener('iceconnectionstatechange', e => onIceStateChange(remoteConnection, e));

  remoteConnection.addEventListener('track', gotRemoteStream);
  localStream.getTracks().forEach(track => myConnection.addTrack(track, localStream));

  console.log("offer 생성");
  const offer = await myConnection.createOffer(offerOptions);
  await onCreateOfferSuccess(offer);

}

// 연결 끊기
function hangup() {
  myConnection.close();
  remoteConnection.close();
  myConnection = null;
  remoteConnection = null;
  // 버튼 비활성화
  hangupButton.disabled = true;
  callButton.disabled = false;
  console.log('hangup streaming!')
}

async function onRemoteIceCandidate(conn, event) {
  await (remoteConnection.addIceCandidate(event.candidate));
}

async function onLocalIceCandidate(conn, event) {
  await (myConnection.addIceCandidate(event.candidate));
}

async function onCreateOfferSuccess(desc) {
  console.log("두 connection에 sdp 등록")
  await myConnection.setLocalDescription(desc);
  await remoteConnection.setRemoteDescription(desc);
  console.log("desc : ", desc);
 
  const answer = await remoteConnection.createAnswer();
  await onCreateAnswerSuccess(answer);

}

function gotRemoteStream(e) {
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0];
  }
}

async function onCreateAnswerSuccess(desc) {
  await remoteConnection.setLocalDescription(desc);
  await myConnection.setRemoteDescription(desc);
}

function onIceStateChange(pc, event) {
  if (pc) {
    console.log('ICE state change event: ', event);
  }
}

init();
function init() {
  callButton.disabled = true;
  hangupButton.disabled = true;
  startButton.addEventListener('click', start);
  callButton.addEventListener('click', call);
  hangupButton.addEventListener('click', hangup);
}