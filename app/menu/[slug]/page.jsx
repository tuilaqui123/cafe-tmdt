export default function ItemView() {
  return (
    <div className="flex flex-row h-screen overflow-hidden border border-black">
      <div className="w-[40%] aspect-square border border-black p-10">
        <img
          src="/item.png"
          alt="Item Image"
          className="w-full  border border-black"
        />
      </div>
      <div className="p-10 text-black">
        <div>name</div>
        <div>price</div>
        <div>rating</div>
        <div>button</div>
        <div>comment</div>
      </div>
    </div>
  );
}
