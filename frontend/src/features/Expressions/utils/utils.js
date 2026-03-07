import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();

  await new Promise((resolve) => {
    if (videoRef.current.readyState >= 2) return resolve();
    videoRef.current.onloadeddata = resolve;
  });
};

export const detect = ({ landmarkerRef, videoRef }) => {
  if (!landmarkerRef.current || !videoRef.current) return "nutural";

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (!results.faceBlendshapes?.length) return "nutural";

  const bs  = results.faceBlendshapes[0].categories;
  const get = (name) => bs.find((b) => b.categoryName === name)?.score ?? 0;

  const smileL    = get("mouthSmileLeft");
  const smileR    = get("mouthSmileRight");
  const jawOpen   = get("jawOpen");
  const browUp    = get("browInnerUp");   // raises for BOTH sad and surprise
  const frownL    = get("mouthFrownLeft");
  const frownR    = get("mouthFrownRight");

  // Happy — both mouth corners up
  if (smileL > 0.5 && smileR > 0.5) return "happy";

  // Surprise — jaw drops AND brows up together
  if (jawOpen > 0.25 && browUp > 0.25) return "surprise";

  // Sad — browInnerUp alone (puppy dog eyes) is the strongest mediapipe sad signal
  // OR mouth corners pulling down even slightly
  if (browUp > 0.2 || frownL > 0.05 || frownR > 0.05) return "sad";

  return "nutural";
};