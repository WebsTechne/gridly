"use client";

import { useEffect, useState } from "react";
import { TableData } from "../../new/new-grid-page";
import { TableClient } from "./table-client";

interface TableLoaderProps {
  id: string;
}

export function TableLoader({ id }: TableLoaderProps) {
  const [table, setTable] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage can only be accessed on the client.
    // This effect will run after the component mounts in the browser.
    const tableJSON = localStorage.getItem(`table-${id}`);
    if (tableJSON) {
      setTable(JSON.parse(tableJSON));
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    // You can replace this with a proper skeleton loader if you have one
    return (
      <p className="text-muted-foreground animate-pulse p-3">Loading...</p>
    );
  }

  if (!table) {
    return (
      <p className="text-muted-foreground text-sm">No table data found.</p>
    );
  }

  return <TableClient table={table} />;
}
