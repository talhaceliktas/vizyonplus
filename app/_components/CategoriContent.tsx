const CategoriContent = ({ katalog }: { katalog: string }) => {
  return (
    <div>
      {katalog === "vizyondakiler" && <div>Vizyondakiler</div>}
      {katalog === "yakindakiler" && <div>Yakindakiler</div>}
      {katalog === "imdb" && <div>IMDB</div>}
    </div>
  );
};

export default CategoriContent;
