import { getAccounts } from "@/app/_actions/data";
import { CardsClient } from "./cards-client";

export const metadata = { title: "Cards" };

export default async function CardsPage() {
  const accounts = await getAccounts();
  const cardAccounts = accounts.filter((a) => a.cardNumber);
  return <CardsClient accounts={cardAccounts} />;
}
