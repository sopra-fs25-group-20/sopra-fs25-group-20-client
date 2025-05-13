"use client";

import { Account } from "@/types/account";
import { Frame } from "./frame";

type Props = {
  profile: Account;
};

export const ProfileCard = ({ profile }: Props) => {
  return (
    <Frame className="profile">
      <div className="profileFrame">
        <div className="logo"></div>
        <div className="info">
          <div className="name">{profile.username}</div>
          <div className="wins">{profile.wins} Wins</div>
        </div>
      </div>
    </Frame>
  );
};
