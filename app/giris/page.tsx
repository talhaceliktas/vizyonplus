import Signup from "../_components/Signup";

const Page = () => {
  return (
    <div className="h-screen w-full px-4 pt-44 pb-22">
      <div className="dis-kutu mx-auto h-full w-full max-w-[1360px] rounded-2xl bg-gray-50">
        <Signup />
      </div>
    </div>
  );
};

export default Page;
