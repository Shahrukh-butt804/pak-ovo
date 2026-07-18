import { useState } from "react";
import { Delete, Eye, Pencil, Recycle, Search, Trash, Trash2, TruckIcon } from "lucide-react";
import { useNavigate } from "react-router";
import Spinner from "../spinner";

const Table = ({
  tableData,
  setPagination,
  pagination,
  onEdit,
  onDelete,
  isDeleting,
  deletingItemId,
}: {
  tableData?: { data: any; exlucdedFields?: string[] };
  setPagination?: any;
  pagination?: any;
  onEdit?: any;
  onDelete?: any;
  isDeleting?: any;
  deletingItemId?: any;
}) => {
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [keyword, setkeyword] = useState("");

  const rows = tableData?.data?.length ? tableData.data : [];

  const columns =
    rows.length > 0
      ? Object.keys(rows[0]).filter((col) => !tableData?.exlucdedFields?.includes(col))
      : [];

  const handleChange = (e: any) => {
    const { value } = e.target;
    setPagination((prevPagination: any) => ({
      ...prevPagination,
      keyword: value,
    }));
    setkeyword(value);
  };

  const handleEntryChange = (e: any) => {
    const { name, value } = e.target;
    setPagination((prevPagination: any) => ({
      ...prevPagination,
      [name]: value,
    }));
    setEntriesPerPage(value);
  };

  return (
    <div className="p-3 md:px-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-5 gap-4 md:gap-0 p-4 md:p-0 ">
        <div className="flex items-center gap-3">
          <label className="text-sm ">Show entries</label>
          <select
            name="limit"
            value={entriesPerPage}
            onChange={handleEntryChange}
            className="glass appearance-none  rounded-lg border border-white/20  px-4 py-2 text-sm  outline-none transition-colors focus:border-white/40"
          >
            <option value={10} >
              10
            </option>
            <option value={20} >
              20
            </option>
            <option value={50} >
              50
            </option>
            <option value={100} >
              100
            </option>
          </select>
        </div>

        <div className="glass flex w-full items-center gap-2 rounded-lg border border-white/20 px-4 py-3 md:w-72">
          <Search className="h-4 w-4 shrink-0 " />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-transparent text-sm  placeholder:text-gray-500 focus:outline-none"
            value={keyword}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass max-w-screen overflow-hidden rounded-2xl border border-white/20 shadow-lg ">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-gray-600">
              <tr>
                {columns.length > 0 && (
                  <>
                    <th className="px-4 py-3 font-medium">S.No</th>
                    {columns.map((col) => (
                      <th key={col} className="whitespace-nowrap px-4 py-3 font-medium">
                        {col.replace(/([A-Z])/g, " $1").trim()}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.length > 0 ? (
                rows.map((row: any, i: number) => (
                  <tr key={row.id || i} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-3 ">{String(i + 1).padStart(2, "0")}</td>

                    {columns.map((col) =>
                      col === "category" || col === "subCategory" ? (
                        <td key={col} className="max-w-xs px-4 py-3">
                          {row[col].name}
                        </td>
                      ) : (
                        <td key={col} className="max-w-xs px-4 py-3 ">
                          {col === "createdAt" || col === "expiryDate" || col === "updatedAt" ? (
                            <span className="whitespace-nowrap ">
                              {new Date(row[col]).toLocaleDateString()}
                            </span>
                          ) : col === "totalAmount" ||
                            col === "amount" ||
                            col === "taxAmount" ||
                            col === "discountAmount" ||
                            col === "subTotal" ? (
                            <span className="font-medium text-emerald-400">
                              ${row[col].toFixed(2)}
                            </span>
                          ) : (
                            <span className="truncate">
                              {String(row[col]).length > 200
                                ? String(row[col]).slice(0, 140) + "..."
                                : String(row[col]) || <span className="text-gray-500">N/A</span>}
                            </span>
                          )}
                        </td>
                      ),
                    )}

                    <td className={`px-4 py-3 text-right flex ${onEdit ? 'justify-between': 'justify-center'} items-center`}>
                      {onEdit && (
                        <button
                        onClick={() => onEdit(row)}
                        className="inline-flex items-center justify-center rounded-full  p-2 text-black transition-colors  removebgColor"
                        >
                        <Pencil className="h-4 w-4 " />
                      </button>
                      )}
                      <button
                        onClick={() => onDelete(row._id)}
                        disabled={isDeleting && deletingItemId === row._id}
                        className="inline-flex items-center justify-center rounded-full  p-2 text-black transition-colors  removebgColor"
                      >
                        {isDeleting && deletingItemId === row._id ? (
                          <Spinner />
                        ) : (
                          Boolean(row.isActive) ? 
                            <Trash2 className="h-4 w-4" color="green" />
                            :
                            <Trash2 className="h-4 w-4" color="red" />
                          
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-12 text-center">
                    <p className="text-gray-500 font-semibold ">No Data Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <Pagination setPagination={setPagination} pagination={pagination} />
      </div>
    </div>
  );
};

export default Table;

const Pagination = ({ setPagination, pagination }: any) => {
  const { totalDocs, currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className="flex flex-col md:flex-row justify-start md:justify-between items-center mt-4 text-sm ">
      <p className="mx-2 md:mx-0">
        Showing page {currentPage} of {totalPages} (Total {totalDocs} entries)
      </p>

      <div
        className="flex items-center space-x-2 glass cursor-pointer mx-2 md:mx-0"
        style={{ padding: "8px 0px", borderRadius: "10px" }}
      >
        <button
          className="px-3 py-1 removebgColor"
          disabled={!hasPrevPage}
          onClick={() =>
            setPagination((prevPagination: any) => ({
              ...prevPagination,
              page: prevPagination.page - 1,
            }))
          }
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1  ${
              page === currentPage ? "bgPink blackText rounded-md" : "removebgColor"
            }`}
            onClick={() =>
              setPagination((prevPagination: any) => ({
                ...prevPagination,
                page: (prevPagination.page = page),
              }))
            }
          >
            {page.toString().padStart(2, "0")}
          </button>
        ))}

        <button
          className="px-3 py-1 removebgColor"
          disabled={!hasNextPage}
          onClick={() =>
            setPagination((prevPagination: any) => ({
              ...prevPagination,
              page: prevPagination.page + 1,
            }))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};
