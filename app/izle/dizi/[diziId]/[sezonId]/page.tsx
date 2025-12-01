const Page = async ({ params }) => {
  const { sezonId } = await params;

  return <div>{sezonId}</div>;
};

export default Page;
