import { ReactNode } from "react";
import { attach, combine, createEvent, createStore, sample } from "effector";
import { get } from "lodash";
import { debounce, reset } from "patronum";

import { Request, requestFx, User } from "~/shared/api";
import { Transaction, UserListResponse } from "~/shared/api/common";
// import { createFilters } from "~/shared/lib/createFilters";
import { Comparator, createSorting } from "~/shared/lib/createSorting";

export type TransactionTypes = "WRITE_OFF" | "REPLENISH";

export const transactionTypes: {
  [Key in TransactionTypes]: {
    type: ReactNode;
    sign: string;
    destructive: boolean;
  };
} = {
  WRITE_OFF: { type: "Списание", sign: "-", destructive: true },
  REPLENISH: { type: "Пополнение", sign: "+", destructive: false },
};

const usersGetFx = attach({ effect: requestFx });
const transactionsGetFx = attach({ effect: requestFx });

export const pageLoaded = createEvent();
export const searchChanged = createEvent<string>();
export const userSelected = createEvent<{ id: string }>();
export const drawerClosed = createEvent();

export const $search = createStore("");
export const $usersList = createStore<User[]>([]);
export const $usersListPending = usersGetFx.pending;
export const $usersListError = createStore<string | null>(null);

export const $isDrawerOpen = createStore(false);

export const $selectedUser = createStore<User | null>(null);
export const $transactionsMap = createStore<Record<string, Transaction[]>>({});
export const $selectedUserTransactionsPending = transactionsGetFx.pending;
export const $selectedUserTransactionsError = createStore<string | null>(null);

$search.on(searchChanged, (_, value) => value);

sample({
  clock: pageLoaded,
  fn: (): Request => ({
    method: "GET",
    path: "user/list",
  }),
  target: usersGetFx,
});

const debouncedSearchChanged = debounce({
  source: searchChanged,
  timeout: 800,
});

$usersList.on(
  usersGetFx.doneData,
  (_, users: UserListResponse) => users.data ?? [],
);

sample({
  clock: debouncedSearchChanged,
  source: $search,
  fn: (_, search): Request => ({
    method: "GET",
    path: "user/list",
    query: { search },
  }),
  target: usersGetFx,
});

sample({
  clock: usersGetFx.failData,
  fn: ({ message }) => message,
  target: $usersListError,
});

sample({
  clock: debouncedSearchChanged,
  fn: () => "",
  target: $usersListError,
});

$isDrawerOpen.on(userSelected, () => true);

sample({
  clock: userSelected,
  source: $usersList,
  fn: (users, { id }) => users?.find((user) => user.id === id) ?? null,
  target: $selectedUser,
});

sample({
  clock: userSelected,
  fn: ({ id }): Request => ({
    method: "GET",
    path: `user/${id}/transactions`,
  }),
  target: transactionsGetFx,
});

$transactionsMap.on(
  transactionsGetFx.doneData,
  (state, transactions: Transaction[]) => {
    const user_id = transactions[0].user_id;
    return { ...state, [user_id]: transactions };
  },
);

$isDrawerOpen.on(drawerClosed, () => false);

reset({
  clock: drawerClosed,
  target: [$selectedUser],
});

const userComparator: Comparator<User> = (records, field, order) => {
  if (!field) return 0;

  const [a, b] = order === "asc" ? records : records.reverse();
  const aValue = get(a, field);
  const bValue = get(b, field);

  return typeof aValue === "number"
    ? aValue - Number(bValue)
    : String(aValue).localeCompare(String(bValue));
};

export const usersSorting = createSorting({
  $allRecords: $usersList,
  comparator: userComparator,
  initialField: "email" as Leaves<User>,
  initialOrder: "asc",
});

const transactionComparator: Comparator<Transaction> = (
  records,
  field,
  order,
) => {
  if (!field) return 0;

  const [a, b] = order === "asc" ? records : records.reverse();
  const aValue = get(a, field);
  const bValue = get(b, field);

  return typeof aValue === "number"
    ? aValue - Number(bValue)
    : String(aValue).localeCompare(String(bValue));
};

const $selectedUserTransactions = combine(
  $transactionsMap,
  $selectedUser,
  (transactionsMap, selectedUser) => {
    if (!selectedUser) return [];
    return transactionsMap[selectedUser.id];
  },
);

export const transactionSorting = createSorting({
  $allRecords: $selectedUserTransactions,
  comparator: transactionComparator,
  initialField: "created_at" as Leaves<Transaction>,
  initialOrder: "desc",
});
