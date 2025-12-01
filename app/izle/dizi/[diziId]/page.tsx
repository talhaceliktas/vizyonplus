const Page = async ({ params }) => {
  const { diziId } = await params;

  return <div>{diziId}</div>;
};

export default Page;
