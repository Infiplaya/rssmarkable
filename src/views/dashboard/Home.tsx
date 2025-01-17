import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "../../components/common/Button";
import { Profile } from "../../components/dashboard/profile/Profile";
import { Tile } from "../../components/dashboard/tile/Tile";
import { AddFeedModal } from "../../components/modal/feed/AddFeedModal";
import { useGenericLoader } from "../../hooks/useGenericLoader";
import { DASHBOARD_CARDS } from "../../utils/consts";
import { trpc } from "../../utils/trpc";

import type { CreateFeedInput } from "../../utils/validation";
import type { TRPCError } from "@trpc/server";

export const HomeView = () => {
  const utils = trpc.useContext();
  const { data } = useSession();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const addFeedMutation = trpc.feed.createFeed.useMutation({
    onSuccess: () => utils.user.getUserFeeds.invalidate(),
  });

  const onAdd = async ({ url }: CreateFeedInput) => {
    await toast.promise(
      addFeedMutation.mutateAsync({
        url,
      }),
      {
        loading: "Adding feed...",
        success: ({ message }) => {
          setIsAddModalOpen(false);
          return message;
        },
        error: (err: TRPCError | Error) => err.message,
      },
    );
  };

  const { data: feeds, isLoading: areFeedsLoading } =
    trpc.user.getUserFeeds.useQuery();
  const { data: device, isLoading: isDeviceLoading } =
    trpc.user.getUserDevice.useQuery();

  useGenericLoader([areFeedsLoading, isDeviceLoading]);

  const values = [
    feeds?.length ?? 0,
    device ? "reMarkable 2" : "Not registered",
    "Coming soon...",
  ];

  return (
    <>
      <AddFeedModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        onAdd={onAdd}
      />
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between">
            <Profile user={data?.user} isRegistered={!!device} />
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <Button
                variant="secondary"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add feed
              </Button>
              <Button>Sync feeds</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Overview
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DASHBOARD_CARDS.map((card, index) => (
              <Tile
                card={{ ...card, value: values[index]! }}
                key={card.title}
              />
            ))}
          </div>
        </div>

        <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
          Recent syncs
        </h2>
        <h3 className="mx-auto mt-2 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-400 sm:px-6 lg:px-8">
          Coming soon
        </h3>
      </div>
    </>
  );
};
