import { useEffect } from "react";
import { useUnit } from "effector-react";

import { Bag, DefaultAvatar } from "~/shared/assets/icons";
import { Input } from "~/shared/ui/input";

import { Drawer } from "./Drawer";
import { $search, pageLoaded, searchChanged } from "./model";
import { Pagination } from "./Pagination";
import { UsersTable } from "./UsersTable";

export const HomePage = () => {
  const [pageInit, serachValue, handleSearchValue] = useUnit([
    pageLoaded,
    $search,
    searchChanged,
  ]);

  useEffect(() => {
    pageInit();
  }, []);

  return (
    <>
      <main className="bg-base-black flex h-[1092px] flex-col items-center justify-end gap-[27px]  pt-6 text-white md:h-screen md:items-start md:justify-start md:gap-8 md:px-10 md:py-[34px] lg:px-[25px]">
        <header className="bg-gray4 flex h-[49px] w-[343px] flex-row items-center gap-3.5 rounded-[10px] px-4 py-2.5 md:h-[78px] md:w-full md:gap-11 md:rounded-[17px] md:px-[18px] md:py-3.5 lg:h-[82px]">
          <div className="flex h-[29px] flex-shrink-0 items-center pr-[26px] text-[22px] font-semibold">
            BitTest
          </div>
          <div className="flex flex-[1_0_0] items-center justify-end gap-2.5">
            <div className="bg-gray3 flex h-6 w-6 items-center justify-center rounded-[4px] px-1 pb-[4.5px] pt-[3.5px]">
              <Bag />
            </div>
            <p className="text-sm">Моя организация</p>
            <div className="hidden md:flex md:flex-[1_0_0] md:items-center md:justify-end">
              <div className="border-gray3 bg-gray4 flex items-center gap-3 rounded-md border px-3.5 py-2">
                <DefaultAvatar />
                <div className="flex flex-col items-start">
                  <p className="text-gray1 text-xs">Вы авторизованы</p>
                  <p className="text-sm font-medium text-white">
                    Администратор
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className="bg-gray4 flex w-full flex-grow flex-col overflow-y-scroll px-4 pb-8 md:w-full md:rounded-[18px] md:px-6">
          <h1 className="py-[18px] text-lg font-semibold md:py-6 md:text-xl">
            Моя организация
          </h1>
          <hr className="border-gray3 h-px" />
          <h2 className="py-[26px] text-lg font-semibold md:py-[27px] md:text-xl">
            Пользователи
          </h2>
          <Input
            name="userSearch"
            type="search"
            value={serachValue}
            onValue={({ value }) => handleSearchValue(value)}
            placeholder="Поиск"
          />
          <UsersTable />
          <Pagination />
        </section>
      </main>
      <Drawer />
    </>
  );
};
