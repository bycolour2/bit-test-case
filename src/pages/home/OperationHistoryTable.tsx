import { useUnit } from "effector-react";

import { Transaction } from "~/shared/api/common";
import { cn } from "~/shared/lib/cn";

import { $selectedUser, transactionSorting, transactionTypes } from "./model";

export const OperationHistoryTable = () => {
  const [selectedUser, transactions] = useUnit([
    $selectedUser,
    transactionSorting.$sortedRecords,
  ]);

  return (
    <div className="max-h-[492px] overflow-y-auto lg:w-[425px]">
      <table className="w-full">
        <thead>
          <tr className="bg-base-black text-gray6 flex h-11 w-full items-start self-stretch  rounded-t-lg text-xs font-medium">
            <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 self-stretch px-5 py-3.5">
              <OperationHistoryTableTitle column={"type"} title="Тип" />
            </td>
            <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
              <OperationHistoryTableTitle column={"amount"} title="Сумма" />
            </td>
            <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
              <OperationHistoryTableTitle column={"created_at"} title="Дата" />
            </td>
          </tr>
        </thead>
        <tbody>
          {selectedUser
            ? transactions.map(({ id, type, amount, created_at }) => {
                return (
                  <tr
                    key={id}
                    className="border-gray3 flex h-16 justify-start self-stretch border-b text-center text-xs font-medium"
                  >
                    <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                      {transactionTypes[type].type}
                    </td>
                    <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                      <p
                        className={cn(
                          transactionTypes[type].destructive
                            ? "text-red-600"
                            : "text-green-600",
                        )}
                      >
                        {transactionTypes[type].sign}
                        {amount.toLocaleString()} BTKN
                      </p>
                    </td>
                    <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                      {new Date(created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            : null}
          {/* {selectedUser
            ? transactions[selectedUser.id].map(
                ({ id, type, amount, created_at }) => {
                  return (
                    <tr
                      key={id}
                      className="border-gray3 flex h-16 justify-start self-stretch border-b text-center text-xs font-medium"
                    >
                      <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                        {transactionTypes[type].type}
                      </td>
                      <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                        <p
                          className={cn(
                            transactionTypes[type].destructive
                              ? "text-red-600"
                              : "text-green-600",
                          )}
                        >
                          {transactionTypes[type].sign}
                          {amount.toLocaleString()} BTKN
                        </p>
                      </td>
                      <td className="flex flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                        {new Date(created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                },
              )
            : null} */}
        </tbody>
      </table>
    </div>
  );
};

const OperationHistoryTableOrder = () => {
  const order = useUnit(transactionSorting.$order);

  return <span className="font-thin">{order === "asc" ? " ↑" : " ↓"}</span>;
};

const OperationHistoryTableTitle = ({
  column,
  title,
}: {
  column: NonNullable<Leaves<Transaction>> | null;
  title: string;
}) => {
  const [field, sortedBy] = useUnit([
    transactionSorting.$field,
    transactionSorting.sortedBy,
  ]);

  return (
    <span
      className="select-none font-medium capitalize"
      role="button"
      tabIndex={0}
      onClick={() => sortedBy(column)}
      onKeyDown={(e) => {
        if (e.key === "Space") {
          sortedBy(column);
        }
      }}
    >
      {title}
      {field === column && <OperationHistoryTableOrder />}
    </span>
  );
};
