import { TableData } from "../../new/new-grid-page";
import { TableClient } from "./table-client";
import { TableLoader } from "./table-loader";

export default async function TablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TableLoader id={id} />;
}
