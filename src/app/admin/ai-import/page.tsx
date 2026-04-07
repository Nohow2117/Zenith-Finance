import { getAccounts } from "@/app/_actions/data";
import { AiImportClient } from "./ai-import-client";

export const metadata = { title: "Admin — AI Importer" };

export default async function AiImportPage() {
  const accounts = await getAccounts();
  return <AiImportClient accounts={accounts} />;
}
