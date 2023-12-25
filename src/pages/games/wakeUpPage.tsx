import wakeUpVideo from '@/assets/video/wakeup.mp4';

export default function WakeUpPage() {
  return (
    <>
      <div className="row-start-1 row-end-2 col-start-1 col-end-2 z-[2] self-center justify-items-center justify-self-center">
        tips
      </div>
      <div className="row-start-1 row-end-2 col-start-2 col-end-3 z-[2] self-center justify-items-center -translate-x-24">
        <video src={wakeUpVideo} muted autoPlay></video>
      </div>
    </>
  );
}
