import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, CardHeader } from "@mui/material";

const columns = [
  { field: "_id", headerName: "ID", width: 240 },
  { field: "membershipType", headerName: "Membership Type", width: 200 },
  { field: "price", headerName: "Price", width: 200 },
  {
    field: "issuedDate",
    headerName: "Issued Date",
    width: 200,
  },
];

export default function InvoiceList({ invoices }) {
  return (
    <Card>
      <CardHeader title="Invoices" />
      <CardContent>
        <DataGrid
          rows={invoices.map((d) => {
            const _d = new Date(d.issuedDate);
            return {
              _id: d._id,
              membershipType: d.membershipType,
              price: d.price,
              issuedDate: `${_d.getFullYear()}-${
                _d.getMonth() + 1
              }-${_d.getDate()}`,
            };
          })}
          columns={columns}
          getRowId={(row) => `#${row._id.toString()}`}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </CardContent>
    </Card>
  );
}
