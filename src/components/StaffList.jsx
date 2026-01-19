import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

function StaffList({ staffs, onDelete, setEditStaff }) {
  const { authUser } = useAuth();
  const isAdmin = (authUser?.role || authUser?.Role)?.toLowerCase() === "admin";

  const columns = useMemo(() => {
    const cols = [
      {
        header: "#",
        cell: (info) => info.table.getRowModel().rows.findIndex((row) => row.id === info.row.id) + 1
      },
      { header: "Name", accessorKey: "name" },
      { header: "Department", accessorKey: "department" },
      { header: "Role", accessorKey: "role" },
    ];

    if (isAdmin) {
      cols.push({
        header: "Salary",
        accessorKey: "salary",
        cell: ({ getValue }) => `₹${Number(getValue()).toLocaleString()}`
      });
      cols.push({
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="action-btns">
            <button className="edit-btn" onClick={() => setEditStaff(row.original)}>✏️ Edit</button>
            <button className="delete-btn" onClick={() => onDelete(row.original.id)}>️ Delete</button>
          </div>
        )
      });
    }
    return cols;
  }, [isAdmin, onDelete, setEditStaff]);

  const table = useReactTable({
    data: staffs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  if (staffs.length === 0) return <p className="no-data">No staff records found.</p>;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: " ", desc: " " }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls*/}
      <div className="pagination-wrapper">
        <button
          className={`p-btn ${!table.getCanPreviousPage() ? 'disabled' : 'active'}`}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>

        <span className="page-info">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount()}</strong>
        </span>

        <button
          className={`p-btn ${!table.getCanNextPage() ? 'disabled' : 'active'}`}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StaffList;