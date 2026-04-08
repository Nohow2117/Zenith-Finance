"use client";

import { motion } from "framer-motion";
import { DebitCard } from "@/components/cards/debit-card";
import type { Account } from "@/types";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function CardsClient({ accounts }: { accounts: Account[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Your Cards</h1>
        <p className="text-sm text-text-secondary mt-1">
          Click &quot;Show Data&quot; and enter your PIN to reveal the protected card details available in the app
        </p>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {accounts.map((account) => (
          <motion.div key={account.id} variants={fadeUp} className="flex justify-center">
            <DebitCard account={account} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
