import React, { useState } from "react";

export default function BorrowReturnPage() {
  const [activeTab, setActiveTab] = useState("borrow");

  const borrowReturns = [
    {
      id: 1,
      title: "The Great Gatsby",
      borrower: "John Smith",
      borrowed: "1/6/2024",
      due: "1/15/2024",
      status: "ACTIVE",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      borrower: "Jane Doe",
      borrowed: "12/20/2023",
      due: "1/3/2024",
      returned: "1/6/2024",
      status: "RETURNED",
    },
    {
      id: 3,
      title: "1984",
      borrower: "Bob Johnson",
      borrowed: "12/15/2023",
      due: "12/29/2023",
      status: "OVERDUE",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      borrower: "Alice Brown",
      borrowed: "1/5/2024",
      due: "1/19/2024",
      status: "ACTIVE",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      borrower: "Charlie Wilson",
      borrowed: "1/3/2024",
      due: "1/17/2024",
      status: "ACTIVE",
    },
  ];

  const handleMarkReturned = (id) => {
    console.log(`Marked as returned: ${id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Borrow & Return</h2>
      <p className="text-sm text-gray-600">
        Manage book borrowing and return operations
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setActiveTab("borrow")}
          className={`px-4 py-2 rounded ${
            activeTab === "borrow" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Borrow Book
        </button>
        <button
          onClick={() => setActiveTab("return")}
          className={`px-4 py-2 rounded ${
            activeTab === "return" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Return Book
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {borrowReturns.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.borrower}</p>
              <p className="text-sm text-gray-600">Borrowed: {item.borrowed}</p>
              <p className="text-sm text-gray-600">Due: {item.due}</p>
              {item.returned && (
                <p className="text-sm text-gray-600">
                  Returned: {item.returned}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-2 py-1 rounded ${
                  item.status === "OVERDUE"
                    ? "bg-red-200 text-red-800"
                    : item.status === "RETURNED"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {item.status}
              </span>
              {item.status === "ACTIVE" && !item.returned && (
                <button
                  onClick={() => handleMarkReturned(item.id)}
                  className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Mark as Returned
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
