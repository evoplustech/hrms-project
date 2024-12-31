const confirmPopup = ()=>{

  const confirmToast = toast(
    (t) => (
      <div>
        <p>Are you sure you want to delete this item?</p>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              toast.dismiss(t.id); // Close the toast
              performDeleteAction(); // Perform the action
            }}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => toast.dismiss(t.id)} // Close the toast
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity, // Keep it open until the user interacts
    }
  );

}



export default confirmPopup;