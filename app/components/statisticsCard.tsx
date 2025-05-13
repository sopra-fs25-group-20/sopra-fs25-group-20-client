"use client";

import { Frame } from "./frame";
import { Account } from "@/types/account";

type Props = {
  profile: Account;
};

export const StatisticsCard = ({ profile }: Props) => {
  return (
    <Frame className="statistics">
      <div className="statistics entry">
        <div className="title">Wins</div>
        <div className="value">{profile.wins}</div>
      </div>
      <div className="statistics entry">
        <div className="title">Defeats</div>
        <div className="value">{profile.defeats}</div>
      </div>
      <div className="statistics entry">
        <div className="title">Win Rate</div>
        <div className="value">
          {profile.wins + profile.defeats === 0
            ? "N/A"
            : `${
              ((profile.wins / (profile.wins + profile.defeats)) * 100).toFixed(
                2,
              )
            }%`}
        </div>
      </div>
      <div className="statistics entry">
        <div className="title">Current Streak</div>
        <div className="value">{profile.current_streak}</div>
      </div>
      <div className="statistics entry">
        <div className="title">Highest Streak</div>
        <div className="value">{profile.highest_streak}</div>
      </div>
    </Frame>
  );
};
