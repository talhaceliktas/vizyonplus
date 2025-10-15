import { SyncLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="fixed flex h-screen w-screen items-center justify-center">
      <SyncLoader size={30} color="var(--color-secondary-2)" />
    </div>
  );
};

export default Loading;
