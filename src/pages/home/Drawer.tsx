import { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useUnit } from "effector-react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment/min/moment-with-locales";

import "chartjs-adapter-moment";

import { Close } from "~/shared/assets/icons";
import { cn } from "~/shared/lib/cn";
import { Spinner } from "~/shared/ui/spinner";

import {
  $isDrawerOpen,
  $selectedUser,
  $selectedUserTransactionsError,
  $selectedUserTransactionsPending,
  $transactionsMap,
  drawerClosed,
  transactionTypes,
} from "./model";
import { OperationHistoryTable } from "./OperationHistoryTable";

export const Drawer = () => {
  const [pending, error, isOpen, handleDrawerClose, selectedUser] = useUnit([
    $selectedUserTransactionsPending,
    $selectedUserTransactionsError,
    $isDrawerOpen,
    drawerClosed,
    $selectedUser,
  ]);
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleDrawerClose()}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleDrawerClose();
              }}
              className="hidden md:absolute md:inset-0 md:block md:bg-black/60"
            />
            <div
              className={cn(
                "bg-gray4 absolute right-0 top-0 z-40 flex h-[1092px] w-full flex-shrink-0 flex-col items-start gap-3.5 overflow-y-auto px-4 py-[30px] text-white md:h-[1173px] md:w-[470px] md:gap-[18px] md:py-14 md:pl-5 md:pr-10 lg:h-screen lg:w-[470px] lg:gap-[20px] lg:overflow-y-scroll lg:px-5",
              )}
            >
              <div className="flex items-center gap-3.5 self-stretch">
                <h5 className="inline-flex flex-grow items-center text-lg font-semibold md:text-xl">
                  {selectedUser?.email}
                </h5>
                <button
                  type="button"
                  onClick={() => handleDrawerClose()}
                  className="inline-flex h-6 w-6 items-center justify-center"
                >
                  <Close />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              {pending ? (
                <div className="flex w-full items-center justify-center pt-14">
                  <Spinner className="text-strong-down h-16 w-16" />
                </div>
              ) : error ? (
                <div className="flex w-full items-center justify-center pt-14">
                  <div className="text-xl text-red-500/80">Error: {error}</div>
                </div>
              ) : (
                <>
                  <h6 className="self-stretch text-xl font-semibold">
                    Использование токенов
                  </h6>
                  <div className="flex w-full flex-col items-center justify-start gap-2">
                    <Chart />
                  </div>
                  <hr className="border-gray3 h-px w-full" />
                  <h6 className="self-stretch text-lg font-semibold md:text-xl">
                    История операций
                  </h6>
                  <OperationHistoryTable />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  zoomPlugin,
);

const Chart = () => {
  const [selectedUser, transactions] = useUnit([
    $selectedUser,
    $transactionsMap,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) chartRef.current.resetZoom();
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "time",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 3,
          callback: (val) => {
            const momentRu = moment(val);
            momentRu.locale("ru");
            return momentRu.format("DD MMM YYYY");
          },
        },
      },
      y: {
        type: "linear",
        position: "right",
        ticks: {
          callback: (val, index, ticks) =>
            index === 0 || index === ticks.length - 1 ? null : val,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "center",
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.006,
          },
          drag: {
            enabled: true,
          },
          mode: "x",
          scaleMode: "x",
        },
      },
    },
  };
  const data: ChartData<"line"> = {
    labels: selectedUser
      ? transactions[selectedUser.id].map(
          (transaction) => transaction.created_at,
        )
      : [],
    datasets: [
      {
        fill: true,
        label: selectedUser?.email,
        data: selectedUser
          ? transactions[selectedUser.id].reduce(
              (acc, transaction, i) => {
                return [
                  ...acc,
                  acc[i] +
                    Number.parseInt(
                      `${transactionTypes[transaction.type].sign}${transaction.amount}`,
                    ),
                ];
              },
              [0],
            )
          : [],
        borderColor: "#1C64F2",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(28,100,242,0.4)");
          gradient.addColorStop(1, "rgba(20,100,242,0.20)");
          return gradient;
        },
      },
    ],
  };
  return (
    <>
      <div className="h-[351px] w-full">
        <Line ref={chartRef} options={options} data={data} className="h-full" />
      </div>
      <button
        type="button"
        onClick={handleResetZoom}
        className="bg-gray2 self-stretch rounded-lg px-2.5 py-1.5 text-sm text-white"
      >
        Сбросить приближение
      </button>
    </>
  );
};
