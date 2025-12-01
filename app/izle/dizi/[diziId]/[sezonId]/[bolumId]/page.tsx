const Page = async ({ params }) => {
  const { bolumId } = await params;

  return <div>{bolumId}</div>;
};

export default Page;
