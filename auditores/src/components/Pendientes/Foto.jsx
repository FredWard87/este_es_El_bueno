import { Container, Card, Icon, Button, Modal } from 'semantic-ui-react';
import './css/Camara.css';
import { useEffect, useRef, useState } from 'react';

function Fotos({ open, onClose, onCapture }) {
  const videoDiv = useRef(null);
  const fotoDiv = useRef(null);
  const [hayFoto, setHayFoto] = useState(false);
  const [stream, setStream] = useState(null);
  const [camera, setCamera] = useState('user'); // 'user' para cámara frontal, 'environment' para trasera

  const verCamara = async () => {
    try {
      if (stream) {
        detenerCamara();
      }
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080, facingMode: camera } // Aumenta la resolución del video
      });
      setStream(currentStream);
      if (videoDiv.current) {
        videoDiv.current.srcObject = currentStream;
        videoDiv.current.play();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const tomarFoto = () => {
    const w = 1920; // Ancho del canvas igual al ancho del video
    const h = 1080; // Altura del canvas igual a la altura del video

    const video = videoDiv.current;
    const foto = fotoDiv.current;

    if (foto && video) {
      foto.width = w;
      foto.height = h;
      const context = foto.getContext('2d');
      context.drawImage(video, 0, 0, w, h);
      setHayFoto(true);

      // Captura la imagen como una base64 string
      const dataUrl = foto.toDataURL('image/png');
      onCapture(dataUrl);
    }
  };

  const cerrarFoto = () => {
    const f = fotoDiv.current;
    if (f) {
      const context = f.getContext('2d');
      context.clearRect(0, 0, f.width, f.height);
      setHayFoto(false);
    }
  };

  const cambiarCamara = () => {
    setCamera(prevCamera => (prevCamera === 'user' ? 'environment' : 'user'));
  };

  useEffect(() => {
    if (open) {
      verCamara();
    } else {
      detenerCamara();
    }

    return () => {
      detenerCamara();
    };
  }, [open, camera]);

  return (
    <Modal open={open} onClose={onClose} size="small" className="fixed-modal">
      <Modal.Content>
        <Container className="miApp" fluid textAlign="center">
          <Card.Group centered>
            <Card>
              <video ref={videoDiv} style={{ width: '100%' }}></video>
              <Card.Content>
                <Button className="camera-button" color="teal" onClick={tomarFoto} disabled={!open}>
                  <span className="material-symbols-outlined">photo_camera</span>
                </Button>
                <Button className="camera-switch-button" color="blue" onClick={cambiarCamara}>
                  <span className="material-symbols-outlined">switch_camera</span>
                </Button>
                <Button color="red" onClick={onClose}>
                  <Icon name="close" /> Cerrar
                </Button>
              </Card.Content>
            </Card>
            <Card>
              <canvas ref={fotoDiv} style={{ width: '100%' }}></canvas>
              {hayFoto && (
                <Card.Content>
                  <Button color="red" onClick={cerrarFoto}>
                    <Icon name="close" /> Cerrar Foto
                  </Button>
                </Card.Content>
              )}
            </Card>
          </Card.Group>
        </Container>
      </Modal.Content>
    </Modal>
  );
}

export default Fotos;
