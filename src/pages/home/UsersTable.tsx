import { useUnit } from "effector-react";
import { motion } from "framer-motion";

import { User } from "~/shared/api";
import { Edit, Trash } from "~/shared/assets/icons";
import { Spinner } from "~/shared/ui/spinner";

import {
  $usersListError,
  $usersListPending,
  userSelected,
  usersSorting,
} from "./model";

export const UsersTable = () => {
  const [users, usersPending, usersError, handleSelect] = useUnit([
    usersSorting.$sortedRecords,
    $usersListPending,
    $usersListError,
    userSelected,
  ]);

  return (
    <>
      <div className="relative mb-6 mt-[18px] w-full flex-grow overflow-x-auto rounded-lg">
        {usersError ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-xl text-red-500/70">Error: {usersError}</div>
          </div>
        ) : (
          <>
            {/* Можно добавить лоадер но тогда фликает, некрасиво */}
            {/* {usersPending ? (
              <div className="absolute inset-0 z-40 flex h-full items-center justify-center bg-black/60">
                <Spinner className="text-strong-down h-16 w-16" />
              </div>
            ) : null} */}
            <table className="w-full table-auto">
              <thead className="sticky -top-px">
                <tr className="bg-base-black text-gray6 flex h-11 items-start overflow-hidden rounded-lg text-xs font-medium">
                  <td className="flex min-w-[250px] flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                    <UserTableTitle column="email" title="Почта" />
                  </td>
                  <td className="flex w-[93px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                    <UserTableTitle column="name" title="Имя" />
                  </td>
                  <td className="flex w-[82px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                    <UserTableTitle column="role" title="Роль" />
                  </td>
                  <td className="flex w-[74px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                    <UserTableTitle
                      column="subscription.plan.type"
                      title="Подписка"
                    />
                  </td>
                  <td className="flex w-[120px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                    <UserTableTitle
                      column="subscription.tokens"
                      title="Токены"
                    />
                  </td>
                  <td className="flex w-[87px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                    Действия
                  </td>
                </tr>
              </thead>
              <tbody>
                {users
                  ? users.map(
                      ({
                        id,
                        email,
                        name,
                        role,
                        subscription: {
                          plan: { type, currency },
                          tokens,
                        },
                      }) => {
                        return (
                          <motion.tr
                            key={id}
                            layout
                            onClick={() => handleSelect({ id })}
                            className="border-gray3 hover:bg-gray5 flex h-16 justify-start self-stretch border-b text-center text-xs font-medium"
                          >
                            <td className="flex min-w-[250px] flex-[1_0_0] items-center justify-center gap-2.5 px-5 py-3.5">
                              {email}
                            </td>
                            <td className="flex w-[93px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                              {name}
                            </td>
                            <td className="flex w-[82px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                              {role}
                            </td>
                            <td className="flex w-[74px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                              {type}
                            </td>
                            <td className="flex w-[120px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                              {tokens} {currency}
                            </td>
                            <td className="flex w-[87px] items-center justify-center gap-2.5 px-5 py-3.5 lg:flex-[1_0_0]">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Edit />
                                <span className="sr-only">Edit row</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Trash />
                                <span className="sr-only">Delete row</span>
                              </button>
                            </td>
                          </motion.tr>
                        );
                      },
                    )
                  : null}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

const UserTableOrder = () => {
  const order = useUnit(usersSorting.$order);

  return <span className="font-thin">{order === "asc" ? " ↑" : " ↓"}</span>;
};

const UserTableTitle = ({
  column,
  title,
}: {
  column: NonNullable<Leaves<User>> | null;
  title: string;
}) => {
  const [field, sortedBy] = useUnit([
    usersSorting.$field,
    usersSorting.sortedBy,
  ]);

  return (
    <span
      className="hover:text-gray6/80 select-none font-medium capitalize"
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
      {field === column && <UserTableOrder />}
    </span>
  );
};
