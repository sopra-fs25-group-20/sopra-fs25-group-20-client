"use client";

import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { useTheme } from "@/context/ThemeContext";
import { ProfileCard } from "@/components/profileCard";
import { StatisticsCard } from "@/components/statisticsCard";
import { VerticalFlex } from "@/components/verticalFlex";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Account } from "@/types/account";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const apiService = useApi();
  const { toggleTheme } = useTheme();
  const [profile, setProfile] = useState<Account | null>(null);

  useEffect(() => {
    const requestProfile = async () => {
      try {
        const response = await apiService.get<Account>(
          `/account/${params.username}`,
        );
        setProfile(response);
      } catch {
        router.push("/404");
      }
    };

    requestProfile();
  }, [apiService, params.username, router]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">
      <div className="landing-page">
        <AppHeader onToggleTheme={toggleTheme} />
        <VerticalFlex>
          <ProfileCard profile={profile} />
          <StatisticsCard profile={profile} />
        </VerticalFlex>
      </div>
    </div>
  );
}
