const socket = io();
const room = 'default';
const localVideo = document.getElementById('localVideo');
const videos = document.getElementById('videos');
const userCountElement = document.querySelector('.user-count');
const peers = {};

// Function to update layout based on number of users
function updateLayout() {
  const remoteVideos = document.querySelectorAll('[id^="remote-"]');
  const totalUsers = remoteVideos.length + 1; // +1 for local user
  
  // Update user count display
  const participantText = totalUsers === 1 ? '1 Participant' : `${totalUsers} Participants`;
  userCountElement.textContent = participantText;
  
  // Remove all existing layout classes
  videos.className = '';
  localVideo.className = '';
  
  if (totalUsers === 1) {
    videos.className = 'single-user';
  } else if (totalUsers === 2) {
    videos.className = 'two-users';
    localVideo.className = 'multi-user';
  } else if (totalUsers === 3) {
    videos.className = 'three-users';
    localVideo.className = 'multi-user';
  } else if (totalUsers === 4) {
    videos.className = 'four-users';
    localVideo.className = 'multi-user';
  } else {
    // 5 or more users - responsive grid
    videos.className = 'many-users';
    localVideo.className = 'multi-user many-users';
  }
}

async function getFrontCameraStream() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoInput = devices.find(d => d.kind === 'videoinput' && d.label.toLowerCase().includes('front'));
  const constraints = videoInput ? { video: { deviceId: videoInput.deviceId } } : { video: { facingMode: 'user' } };
  return navigator.mediaDevices.getUserMedia(constraints);
}

let localStream;
getFrontCameraStream().then(stream => {
  localStream = stream;
  localVideo.srcObject = stream;
  socket.emit('join', room);
  updateLayout(); // Initial layout update
});

function createPeerConnection(id) {
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.emit('signal', { to: id, candidate: e.candidate });
    }
  };
  pc.ontrack = e => {
    let remoteVideo = document.getElementById('remote-' + id);
    if (!remoteVideo) {
      remoteVideo = document.createElement('video');
      remoteVideo.id = 'remote-' + id;
      remoteVideo.className = 'remote-video';
      remoteVideo.autoplay = true;
      remoteVideo.playsInline = true;
      videos.appendChild(remoteVideo);
      updateLayout(); // Update layout when new user joins
    }
    remoteVideo.srcObject = e.streams[0];
  };
  return pc;
}

socket.on('user-joined', async id => {
  const pc = createPeerConnection(id);
  peers[id] = pc;
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit('signal', { to: id, description: pc.localDescription });
});

socket.on('signal', async ({ id, description, candidate }) => {
  let pc = peers[id];
  if (!pc) {
    pc = createPeerConnection(id);
    peers[id] = pc;
  }
  if (description) {
    await pc.setRemoteDescription(description);
    if (description.type === 'offer') {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('signal', { to: id, description: pc.localDescription });
    }
  }
  if (candidate) {
    try { await pc.addIceCandidate(candidate); } catch {}
  }
});

socket.on('user-left', id => {
  if (peers[id]) {
    peers[id].close();
    delete peers[id];
    const remoteVideo = document.getElementById('remote-' + id);
    if (remoteVideo) {
      remoteVideo.remove();
      updateLayout(); // Update layout when user leaves
    }
  }
}); 