import { Table } from "@/types";

import WatchButton from "./WatchButton";
import ContentButtons from "./ContentButtons";
import ContentVote from "./ContentVote";
import ContentRate from "./ContentRate";

interface ActionBarProps {
  content: Table<"icerikler"> & { film_ucretleri?: any[] };
  user: any;
  interactions: {
    isSubscribed: boolean;
    userRating: number | null;
    watchHistory: any;
    voteStatus: boolean | null;
    watchLater: boolean;
    favorite: boolean;
  };
  averageRating: {
    average: number;
    count: number;
  };
}

export default function ActionBar({
  content,
  user,
  interactions,
  averageRating,
}: ActionBarProps) {
  const { isSubscribed, watchHistory, userRating, voteStatus } = interactions;

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <WatchButton
            icerikId={content.id}
            aboneMi={isSubscribed}
            tur={content.tur}
            sonIzlenen={watchHistory}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="flex items-center gap-x-4">
          <ContentButtons
            id={content.id}
            user={user}
            favorite={interactions.favorite}
            watchLater={interactions.watchLater}
          />

          <ContentVote contentId={content.id} currentStatus={voteStatus} />
        </div>

        {user && (
          <div className="flex justify-start md:justify-end">
            <ContentRate
              contentId={content.id}
              userRating={userRating}
              averageRating={averageRating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
